/*
 * Copyright 2024 English Vocabulary Practice Template Generator Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Network Resilience Utilities
 * Provides retry logic, exponential backoff, and error recovery for network operations
 */

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  timeout?: number;
  retryCondition?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any) => void;
  onSuccess?: (attempt: number) => void;
  onFailure?: (error: any, attempts: number) => void;
}

export interface NetworkError extends Error {
  code?: string;
  status?: number;
  isRetryable?: boolean;
  attempt?: number;
  totalAttempts?: number;
}

export class NetworkResilience {
  private static readonly DEFAULT_OPTIONS: Required<RetryOptions> = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 30000, // 30 seconds
    backoffFactor: 2,
    timeout: 60000, // 60 seconds
    retryCondition: (error: any) => NetworkResilience.isRetryableError(error),
    onRetry: () => {},
    onSuccess: () => {},
    onFailure: () => {}
  };

  /**
   * Execute a function with retry logic and exponential backoff
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    let lastError: any;

    for (let attempt = 1; attempt <= opts.maxRetries + 1; attempt++) {
      try {
        // Add timeout wrapper
        const result = await this.withTimeout(operation(), opts.timeout);
        
        if (attempt > 1) {
          opts.onSuccess(attempt);
        }
        
        return result;
      } catch (error) {
        lastError = error;
        
        // Enhance error with attempt information
        if (error instanceof Error) {
          (error as NetworkError).attempt = attempt;
          (error as NetworkError).totalAttempts = opts.maxRetries + 1;
        }

        // Don't retry on the last attempt
        if (attempt > opts.maxRetries) {
          break;
        }

        // Check if error is retryable
        if (!opts.retryCondition(error)) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          opts.baseDelay * Math.pow(opts.backoffFactor, attempt - 1),
          opts.maxDelay
        );

        opts.onRetry(attempt, error);
        
        // Wait before retrying
        await this.delay(delay);
      }
    }

    opts.onFailure(lastError, opts.maxRetries + 1);
    throw lastError;
  }

  /**
   * Execute Git operations with retry logic
   */
  static async gitWithRetry(
    command: string,
    cwd: string,
    options: RetryOptions = {}
  ): Promise<string> {
    const { execSync } = require('child_process');
    
    const gitOptions = {
      ...options,
      retryCondition: (error: any) => this.isRetryableGitError(error),
      onRetry: (attempt: number, error: any) => {
        console.log(`Git retry attempt ${attempt}: ${command}`);
        console.log(`Error: ${error.message}`);
        if (options.onRetry) options.onRetry(attempt, error);
      },
      onSuccess: (attempt: number) => {
        if (attempt > 1) {
          console.log(`Git command succeeded after ${attempt} attempts: ${command}`);
        }
        if (options.onSuccess) options.onSuccess(attempt);
      },
      onFailure: (error: any, attempts: number) => {
        console.error(`Git command failed after ${attempts} attempts: ${command}`);
        console.error(`Final error: ${error.message}`);
        if (options.onFailure) options.onFailure(error, attempts);
      }
    };

    return this.withRetry(async () => {
      try {
        const result = execSync(command, { 
          cwd, 
          encoding: 'utf8',
          timeout: gitOptions.timeout
        });
        return result.toString().trim();
      } catch (error: any) {
        // Enhance error with Git-specific information
        const gitError = new Error(`Git command failed: ${command}`) as NetworkError;
        gitError.code = error.code;
        gitError.status = error.status;
        gitError.isRetryable = this.isRetryableGitError(error);
        gitError.stack = error.stack;
        throw gitError;
      }
    }, gitOptions);
  }

  /**
   * Execute HTTP requests with retry logic
   */
  static async fetchWithRetry(
    url: string,
    init?: RequestInit,
    options: RetryOptions = {}
  ): Promise<Response> {
    const fetchOptions = {
      ...options,
      retryCondition: (error: any) => this.isRetryableHttpError(error),
      onRetry: (attempt: number, error: any) => {
        console.log(`HTTP retry attempt ${attempt}: ${url}`);
        console.log(`Error: ${error.message}`);
        if (options.onRetry) options.onRetry(attempt, error);
      }
    };

    return this.withRetry(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchOptions.timeout);

      try {
        const response = await fetch(url, {
          ...init,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const httpError = new Error(`HTTP ${response.status}: ${response.statusText}`) as NetworkError;
          httpError.status = response.status;
          httpError.isRetryable = this.isRetryableHttpStatus(response.status);
          throw httpError;
        }

        return response;
      } catch (error: any) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          const timeoutError = new Error('Request timeout') as NetworkError;
          timeoutError.code = 'TIMEOUT';
          timeoutError.isRetryable = true;
          throw timeoutError;
        }
        
        throw error;
      }
    }, fetchOptions);
  }

  /**
   * Check if an error is retryable
   */
  private static isRetryableError(error: any): boolean {
    if (error?.isRetryable !== undefined) {
      return error.isRetryable;
    }

    // Network errors
    if (error?.code === 'ENOTFOUND' || 
        error?.code === 'ECONNREFUSED' || 
        error?.code === 'ETIMEDOUT' ||
        error?.code === 'ECONNRESET' ||
        error?.code === 'TIMEOUT') {
      return true;
    }

    // HTTP status codes
    if (error?.status) {
      return this.isRetryableHttpStatus(error.status);
    }

    return false;
  }

  /**
   * Check if a Git error is retryable
   */
  private static isRetryableGitError(error: any): boolean {
    if (!error?.message) return false;

    const retryableMessages = [
      'Connection timed out',
      'Could not resolve host',
      'Failed to connect',
      'Connection refused',
      'Network is unreachable',
      'Temporary failure',
      'The remote end hung up unexpectedly',
      'RPC failed',
      'HTTP request failed'
    ];

    const message = error.message.toLowerCase();
    return retryableMessages.some(msg => message.includes(msg.toLowerCase()));
  }

  /**
   * Check if an HTTP error is retryable
   */
  private static isRetryableHttpError(error: any): boolean {
    // Network errors are retryable
    if (error?.code === 'ENOTFOUND' || 
        error?.code === 'ECONNREFUSED' || 
        error?.code === 'ETIMEDOUT' ||
        error?.code === 'TIMEOUT') {
      return true;
    }

    // HTTP status codes
    if (error?.status) {
      return this.isRetryableHttpStatus(error.status);
    }

    return false;
  }

  /**
   * Check if an HTTP status code is retryable
   */
  private static isRetryableHttpStatus(status: number): boolean {
    // 5xx server errors are retryable
    if (status >= 500 && status < 600) {
      return true;
    }

    // Specific 4xx errors that might be temporary
    const retryable4xx = [408, 429]; // Request Timeout, Too Many Requests
    return retryable4xx.includes(status);
  }

  /**
   * Add timeout to a promise
   */
  private static withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const error = new Error('Operation timeout') as NetworkError;
        error.code = 'TIMEOUT';
        error.isRetryable = true;
        reject(error);
      }, timeout);

      promise
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeoutId));
    });
  }

  /**
   * Create a delay promise
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create a circuit breaker for repeated failures
   */
  static createCircuitBreaker(
    operation: () => Promise<any>,
    options: {
      failureThreshold?: number;
      resetTimeout?: number;
      monitoringPeriod?: number;
    } = {}
  ) {
    const {
      failureThreshold = 5,
      resetTimeout = 60000, // 1 minute
      monitoringPeriod = 10000 // 10 seconds
    } = options;

    let state: 'closed' | 'open' | 'half-open' = 'closed';
    let failureCount = 0;
    let lastFailureTime = 0;
    let nextAttemptTime = 0;

    return async () => {
      const now = Date.now();

      // Check if circuit should be reset
      if (state === 'open' && now >= nextAttemptTime) {
        state = 'half-open';
        failureCount = 0;
      }

      // Reject immediately if circuit is open
      if (state === 'open') {
        const error = new Error('Circuit breaker is open') as NetworkError;
        error.code = 'CIRCUIT_OPEN';
        error.isRetryable = false;
        throw error;
      }

      try {
        const result = await operation();
        
        // Reset on success
        if (state === 'half-open') {
          state = 'closed';
          failureCount = 0;
        }
        
        return result;
      } catch (error) {
        failureCount++;
        lastFailureTime = now;

        // Open circuit if threshold reached
        if (failureCount >= failureThreshold) {
          state = 'open';
          nextAttemptTime = now + resetTimeout;
        }

        throw error;
      }
    };
  }
}
