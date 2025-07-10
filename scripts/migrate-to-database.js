const fs = require('fs');
const path = require('path');

/**
 * Migration script to move vocabulary data from TypeScript files to JSON database
 */

// Import the database manager (we'll need to compile TypeScript first)
const { execSync } = require('child_process');

/**
 * Extract vocabulary words from TypeScript file content
 */
function extractVocabularyFromFile(filePath) {
  console.log(`\nExtracting vocabulary from: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const words = [];

  // More robust regex to extract vocabulary objects
  const objectRegex = /{\s*id:\s*['"`]([^'"`]+)['"`][^}]*?}/gs;
  
  let match;
  while ((match = objectRegex.exec(content)) !== null) {
    try {
      // Find the complete object by counting braces
      const startIndex = match.index;
      let braceCount = 0;
      let endIndex = startIndex;
      let inString = false;
      let stringChar = '';
      
      for (let i = startIndex; i < content.length; i++) {
        const char = content[i];
        const prevChar = i > 0 ? content[i-1] : '';
        
        if (!inString && (char === '"' || char === "'" || char === '`')) {
          inString = true;
          stringChar = char;
        } else if (inString && char === stringChar && prevChar !== '\\') {
          inString = false;
          stringChar = '';
        } else if (!inString) {
          if (char === '{') braceCount++;
          if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
              endIndex = i;
              break;
            }
          }
        }
      }
      
      const objectStr = content.substring(startIndex, endIndex + 1);
      
      // Parse the object string to extract properties
      const word = parseVocabularyObject(objectStr);
      if (word) {
        words.push(word);
      }
    } catch (error) {
      console.error(`Error parsing vocabulary object: ${error.message}`);
    }
  }

  console.log(`Extracted ${words.length} vocabulary words`);
  return words;
}

/**
 * Parse a vocabulary object string to extract properties
 */
function parseVocabularyObject(objectStr) {
  try {
    // Extract properties using regex
    const props = {};
    
    // Extract string properties
    const stringProps = ['id', 'word', 'phonetic', 'translation', 'grade', 'category', 'difficulty', 'partOfSpeech', 'example', 'textbookVersion', 'unit'];
    for (const prop of stringProps) {
      const regex = new RegExp(`${prop}:\\s*['"\`]([^'"\`]+)['"\`]`);
      const match = objectStr.match(regex);
      if (match) {
        props[prop] = match[1];
      }
    }
    
    // Extract number properties
    const numberProps = ['frequency', 'masteryLevel'];
    for (const prop of numberProps) {
      const regex = new RegExp(`${prop}:\\s*(\\d+)`);
      const match = objectStr.match(regex);
      if (match) {
        props[prop] = parseInt(match[1], 10);
      }
    }
    
    // Extract boolean properties
    const boolProps = ['isLearned'];
    for (const prop of boolProps) {
      const regex = new RegExp(`${prop}:\\s*(true|false)`);
      const match = objectStr.match(regex);
      if (match) {
        props[prop] = match[1] === 'true';
      }
    }
    
    // Extract array properties
    const collocationsMatch = objectStr.match(/collocations:\s*\[(.*?)\]/s);
    if (collocationsMatch) {
      const arrayContent = collocationsMatch[1];
      const items = arrayContent.split(',').map(item => {
        const trimmed = item.trim();
        const match = trimmed.match(/['"`]([^'"`]+)['"`]/);
        return match ? match[1] : null;
      }).filter(Boolean);
      props.collocations = items;
    }
    
    // Validate required properties
    if (!props.id || !props.word || !props.grade) {
      console.warn(`Skipping incomplete vocabulary object: ${JSON.stringify(props)}`);
      return null;
    }
    
    return props;
  } catch (error) {
    console.error(`Error parsing vocabulary object: ${error.message}`);
    return null;
  }
}

/**
 * Create database structure
 */
function createDatabase() {
  return {
    vocabulary: [],
    categories: [],
    userProgress: [],
    importSessions: [],
    stats: {
      totalVocabulary: 0,
      vocabularyByGrade: {
        primary1: 0, primary2: 0, primary3: 0, primary4: 0, primary5: 0, primary6: 0,
        grade7: 0, grade8: 0, grade9: 0
      },
      vocabularyByCategory: {},
      totalCategories: 0,
      totalUsers: 0,
      lastUpdated: new Date().toISOString()
    },
    version: '1.0.0'
  };
}

/**
 * Update database statistics
 */
function updateStats(db) {
  const stats = {
    totalVocabulary: db.vocabulary.length,
    vocabularyByGrade: {
      primary1: 0, primary2: 0, primary3: 0, primary4: 0, primary5: 0, primary6: 0,
      grade7: 0, grade8: 0, grade9: 0
    },
    vocabularyByCategory: {},
    totalCategories: db.categories.length,
    totalUsers: 0,
    lastUpdated: new Date().toISOString()
  };

  // Count by grade
  for (const word of db.vocabulary) {
    if (stats.vocabularyByGrade[word.grade] !== undefined) {
      stats.vocabularyByGrade[word.grade]++;
    }
  }

  // Count by category
  for (const word of db.vocabulary) {
    stats.vocabularyByCategory[word.category] = (stats.vocabularyByCategory[word.category] || 0) + 1;
  }

  db.stats = stats;
}

/**
 * Extract unique categories from vocabulary
 */
function extractCategories(vocabulary) {
  const categoryMap = new Map();
  
  for (const word of vocabulary) {
    if (!categoryMap.has(word.category)) {
      categoryMap.set(word.category, {
        id: `cat_${categoryMap.size + 1}`,
        name: word.category,
        description: `Category for ${word.category} related vocabulary`,
        gradeLevel: word.grade,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }
  
  return Array.from(categoryMap.values());
}

/**
 * Main migration function
 */
async function main() {
  console.log('🚀 Starting Database Migration');
  console.log('Moving vocabulary data from TypeScript files to JSON database\n');

  const vocabularyFiles = [
    path.join(__dirname, '../src/data/vocabulary.ts'),
    path.join(__dirname, '../src/data/extendedVocabulary.ts'),
    path.join(__dirname, '../src/data/juniorHighVocabulary.ts')
  ];

  // Extract all vocabulary words
  let allVocabulary = [];
  for (const filePath of vocabularyFiles) {
    const words = extractVocabularyFromFile(filePath);
    allVocabulary.push(...words);
  }

  console.log(`\n📊 Total vocabulary words extracted: ${allVocabulary.length}`);

  // Create database structure
  const db = createDatabase();
  
  // Add vocabulary with timestamps
  const now = new Date().toISOString();
  db.vocabulary = allVocabulary.map(word => ({
    ...word,
    createdAt: now,
    updatedAt: now
  }));

  // Extract and add categories
  db.categories = extractCategories(allVocabulary);
  
  // Update statistics
  updateStats(db);

  // Ensure data directory exists
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Save database
  const dbPath = path.join(dataDir, 'vocabulary.db.json');
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  // Generate migration report
  const report = generateMigrationReport(db);
  const reportPath = path.join(__dirname, '../DATABASE_MIGRATION_REPORT.md');
  fs.writeFileSync(reportPath, report);

  console.log('\n🎉 Database migration completed successfully!');
  console.log(`📄 Database saved to: ${dbPath}`);
  console.log(`📊 Migration report saved to: ${reportPath}`);
  console.log(`\nDatabase Statistics:`);
  console.log(`- Total vocabulary: ${db.stats.totalVocabulary}`);
  console.log(`- Total categories: ${db.stats.totalCategories}`);
  console.log(`- Grade distribution:`, db.stats.vocabularyByGrade);
}

/**
 * Generate migration report
 */
function generateMigrationReport(db) {
  let report = `# Database Migration Report\n\n`;
  report += `**Migration Date**: ${new Date().toISOString()}\n`;
  report += `**Database Version**: ${db.version}\n`;
  report += `**Total Records Migrated**: ${db.vocabulary.length}\n\n`;

  report += `## Migration Summary\n\n`;
  report += `- ✅ Vocabulary words: ${db.vocabulary.length}\n`;
  report += `- ✅ Categories: ${db.categories.length}\n`;
  report += `- ✅ Database structure created\n`;
  report += `- ✅ Statistics calculated\n\n`;

  report += `## Grade Distribution\n\n`;
  report += `| Grade | Count |\n`;
  report += `|-------|-------|\n`;
  for (const [grade, count] of Object.entries(db.stats.vocabularyByGrade)) {
    report += `| ${grade} | ${count} |\n`;
  }

  report += `\n## Category Distribution\n\n`;
  report += `| Category | Count |\n`;
  report += `|----------|-------|\n`;
  for (const [category, count] of Object.entries(db.stats.vocabularyByCategory)) {
    report += `| ${category} | ${count} |\n`;
  }

  report += `\n## Database Schema\n\n`;
  report += `The database includes the following tables:\n\n`;
  report += `- **vocabulary**: Main vocabulary words with 7-digit IDs\n`;
  report += `- **categories**: Vocabulary categories\n`;
  report += `- **userProgress**: User learning progress (empty after migration)\n`;
  report += `- **importSessions**: Import session logs (empty after migration)\n`;
  report += `- **stats**: Database statistics\n\n`;

  report += `## Next Steps\n\n`;
  report += `1. Update application to use the new database\n`;
  report += `2. Test vocabulary loading and filtering\n`;
  report += `3. Implement import/export functionality\n`;
  report += `4. Add user progress tracking\n`;

  return report;
}

// Run migration
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, extractVocabularyFromFile };
