const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Resilient Git Push Script
 * Implements retry logic with exponential backoff for Git operations
 */

class ResilientGitPush {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 2000; // 2 seconds
    this.maxDelay = options.maxDelay || 30000; // 30 seconds
    this.backoffFactor = options.backoffFactor || 2;
    this.timeout = options.timeout || 120000; // 2 minutes
    this.cwd = options.cwd || process.cwd();
  }

  /**
   * Execute a command with retry logic
   */
  async executeWithRetry(command, description) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.maxRetries + 1; attempt++) {
      try {
        console.log(`\n🔄 ${description} (Attempt ${attempt}/${this.maxRetries + 1})`);
        console.log(`📝 Command: ${command}`);
        
        const result = execSync(command, {
          cwd: this.cwd,
          encoding: 'utf8',
          timeout: this.timeout,
          stdio: 'pipe'
        });
        
        if (attempt > 1) {
          console.log(`✅ ${description} succeeded after ${attempt} attempts`);
        } else {
          console.log(`✅ ${description} succeeded`);
        }
        
        return result.toString().trim();
      } catch (error) {
        lastError = error;
        
        console.log(`❌ ${description} failed on attempt ${attempt}`);
        console.log(`   Error: ${error.message}`);
        
        // Don't retry on the last attempt
        if (attempt > this.maxRetries) {
          break;
        }
        
        // Check if error is retryable
        if (!this.isRetryableError(error)) {
          console.log(`   Error is not retryable, stopping attempts`);
          break;
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          this.baseDelay * Math.pow(this.backoffFactor, attempt - 1),
          this.maxDelay
        );
        
        console.log(`   Waiting ${delay}ms before retry...`);
        await this.delay(delay);
      }
    }
    
    console.log(`💥 ${description} failed after all attempts`);
    throw lastError;
  }

  /**
   * Check if an error is retryable
   */
  isRetryableError(error) {
    if (!error.message) return false;
    
    const retryableMessages = [
      'Connection timed out',
      'Could not resolve host',
      'Failed to connect',
      'Connection refused',
      'Network is unreachable',
      'Temporary failure',
      'The remote end hung up unexpectedly',
      'RPC failed',
      'HTTP request failed',
      'fatal: unable to access',
      'error: failed to push',
      'Connection reset by peer',
      'SSL_ERROR_SYSCALL'
    ];
    
    const message = error.message.toLowerCase();
    return retryableMessages.some(msg => message.includes(msg.toLowerCase()));
  }

  /**
   * Create a delay promise
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check Git status
   */
  async checkGitStatus() {
    try {
      const status = await this.executeWithRetry(
        'git status --porcelain',
        'Checking Git status'
      );
      return status;
    } catch (error) {
      console.log('⚠️  Could not check Git status, continuing anyway');
      return '';
    }
  }

  /**
   * Add all changes
   */
  async addChanges() {
    return this.executeWithRetry(
      'git add .',
      'Adding changes to Git'
    );
  }

  /**
   * Commit changes
   */
  async commitChanges(message) {
    const commitMessage = message || `Auto-commit: ${new Date().toISOString()}`;
    return this.executeWithRetry(
      `git commit -m "${commitMessage}"`,
      'Committing changes'
    );
  }

  /**
   * Push to remote
   */
  async pushToRemote(remote = 'origin', branch = 'main') {
    return this.executeWithRetry(
      `git push ${remote} ${branch}`,
      `Pushing to ${remote}/${branch}`
    );
  }

  /**
   * Check remote connectivity
   */
  async checkRemoteConnectivity() {
    try {
      await this.executeWithRetry(
        'git ls-remote --heads origin',
        'Checking remote connectivity'
      );
      return true;
    } catch (error) {
      console.log('⚠️  Remote connectivity check failed');
      return false;
    }
  }

  /**
   * Get current branch
   */
  async getCurrentBranch() {
    try {
      const branch = await this.executeWithRetry(
        'git rev-parse --abbrev-ref HEAD',
        'Getting current branch'
      );
      return branch;
    } catch (error) {
      console.log('⚠️  Could not determine current branch, using "main"');
      return 'main';
    }
  }

  /**
   * Main push operation
   */
  async push(commitMessage, options = {}) {
    const {
      remote = 'origin',
      branch = null,
      skipConnectivityCheck = false,
      addChanges = true
    } = options;

    console.log('🚀 Starting resilient Git push operation');
    console.log(`📁 Working directory: ${this.cwd}`);
    console.log(`🔄 Max retries: ${this.maxRetries}`);
    console.log(`⏱️  Timeout: ${this.timeout}ms`);

    try {
      // Check remote connectivity first (unless skipped)
      if (!skipConnectivityCheck) {
        const isConnected = await this.checkRemoteConnectivity();
        if (!isConnected) {
          throw new Error('Cannot connect to remote repository');
        }
      }

      // Get current branch
      const currentBranch = branch || await this.getCurrentBranch();
      console.log(`🌿 Current branch: ${currentBranch}`);

      // Check if there are changes to commit
      if (addChanges) {
        const status = await this.checkGitStatus();
        
        if (status.trim() === '') {
          console.log('ℹ️  No changes to commit');
          return { success: true, message: 'No changes to commit' };
        }

        console.log('📝 Changes detected:');
        console.log(status);

        // Add changes
        await this.addChanges();

        // Commit changes
        await this.commitChanges(commitMessage);
      }

      // Push to remote
      await this.pushToRemote(remote, currentBranch);

      console.log('\n🎉 Git push operation completed successfully!');
      return { 
        success: true, 
        message: 'Push completed successfully',
        branch: currentBranch,
        remote: remote
      };

    } catch (error) {
      console.log('\n💥 Git push operation failed');
      console.log(`❌ Final error: ${error.message}`);
      
      return {
        success: false,
        error: error.message,
        suggestions: this.generateErrorSuggestions(error)
      };
    }
  }

  /**
   * Generate error suggestions
   */
  generateErrorSuggestions(error) {
    const suggestions = [];
    const message = error.message.toLowerCase();

    if (message.includes('connection') || message.includes('network')) {
      suggestions.push('Check your internet connection');
      suggestions.push('Try using a VPN if behind a firewall');
      suggestions.push('Check if GitHub is accessible');
    }

    if (message.includes('authentication') || message.includes('permission')) {
      suggestions.push('Check your Git credentials');
      suggestions.push('Verify SSH key or personal access token');
      suggestions.push('Ensure you have push permissions to the repository');
    }

    if (message.includes('rejected') || message.includes('non-fast-forward')) {
      suggestions.push('Pull the latest changes first: git pull origin main');
      suggestions.push('Check for conflicts and resolve them');
    }

    if (message.includes('timeout')) {
      suggestions.push('Try again with a better network connection');
      suggestions.push('Increase timeout value');
      suggestions.push('Try pushing smaller commits');
    }

    if (suggestions.length === 0) {
      suggestions.push('Check Git configuration and repository settings');
      suggestions.push('Try running the Git command manually for more details');
    }

    return suggestions;
  }
}

/**
 * Main execution function
 */
async function main() {
  const args = process.argv.slice(2);
  const commitMessage = args[0] || 'Enhanced project with 7-digit ID system, SQLite database, import functionality, and network resilience';
  
  const options = {
    cwd: process.cwd(),
    maxRetries: 3,
    baseDelay: 2000,
    maxDelay: 30000,
    backoffFactor: 2,
    timeout: 120000
  };

  const gitPush = new ResilientGitPush(options);
  
  try {
    const result = await gitPush.push(commitMessage, {
      remote: 'origin',
      addChanges: true,
      skipConnectivityCheck: false
    });

    if (result.success) {
      console.log('\n✅ Operation completed successfully');
      process.exit(0);
    } else {
      console.log('\n❌ Operation failed');
      console.log('💡 Suggestions:');
      result.suggestions.forEach(suggestion => {
        console.log(`   • ${suggestion}`);
      });
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Unexpected error:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = ResilientGitPush;

// Run if executed directly
if (require.main === module) {
  main();
}
