const fs = require('fs');
const path = require('path');

// Grade mapping for ID conversion
const GRADE_MAPPINGS = {
  'primary1': '01',
  'primary2': '02', 
  'primary3': '03',
  'primary4': '04',
  'primary5': '05',
  'primary6': '06',
  'grade7': '07',
  'grade8': '08',
  'grade9': '09'
};

/**
 * Generate new 7-digit ID
 * @param {string} grade - Grade level
 * @param {number} sequence - Sequence number within grade
 * @returns {string} 7-digit ID in format CCNNNNN
 */
function generateNewId(grade, sequence) {
  const gradeCode = GRADE_MAPPINGS[grade];
  if (!gradeCode) {
    throw new Error(`Invalid grade: ${grade}`);
  }
  return gradeCode + sequence.toString().padStart(5, '0');
}

/**
 * Extract vocabulary words from TypeScript file content
 * @param {string} content - File content
 * @returns {Array} Array of vocabulary word objects
 */
function extractVocabularyWords(content) {
  const words = [];
  
  // Find all vocabulary word objects using regex
  const wordRegex = /{\s*id:\s*['"`]([^'"`]+)['"`][^}]*word:\s*['"`]([^'"`]+)['"`][^}]*grade:\s*['"`]([^'"`]+)['"`][^}]*}/gs;
  
  let match;
  while ((match = wordRegex.exec(content)) !== null) {
    const [fullMatch, id, word, grade] = match;
    
    // Extract the full object by finding the complete braces
    const startIndex = content.indexOf(fullMatch);
    let braceCount = 0;
    let endIndex = startIndex;
    let inString = false;
    let stringChar = '';
    
    for (let i = startIndex; i < content.length; i++) {
      const char = content[i];
      
      if (!inString && (char === '"' || char === "'" || char === '`')) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && content[i-1] !== '\\') {
        inString = false;
        stringChar = '';
      } else if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (braceCount === 0) {
          endIndex = i;
          break;
        }
      }
    }
    
    const objectStr = content.substring(startIndex, endIndex + 1);
    words.push({
      originalId: id,
      word: word,
      grade: grade,
      objectString: objectStr,
      startIndex: startIndex,
      endIndex: endIndex + 1
    });
  }
  
  return words;
}

/**
 * Migrate vocabulary IDs in a file
 * @param {string} filePath - Path to the vocabulary file
 * @returns {Object} Migration results
 */
function migrateVocabularyFile(filePath) {
  console.log(`\nMigrating file: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  const words = extractVocabularyWords(content);
  
  console.log(`Found ${words.length} vocabulary words`);
  
  // Group words by grade and assign new IDs
  const gradeCounters = {};
  const migrations = [];
  
  // Sort words by their original position to maintain order
  words.sort((a, b) => a.startIndex - b.startIndex);
  
  for (const word of words) {
    const grade = word.grade;
    
    if (!gradeCounters[grade]) {
      gradeCounters[grade] = 0;
    }
    
    gradeCounters[grade]++;
    const newId = generateNewId(grade, gradeCounters[grade]);
    
    migrations.push({
      originalId: word.originalId,
      newId: newId,
      word: word.word,
      grade: grade,
      objectString: word.objectString,
      startIndex: word.startIndex,
      endIndex: word.endIndex
    });
    
    console.log(`  ${word.originalId} -> ${newId} (${word.word}, ${grade})`);
  }
  
  // Apply migrations in reverse order to maintain string positions
  let newContent = content;
  for (let i = migrations.length - 1; i >= 0; i--) {
    const migration = migrations[i];
    const oldObjectStr = migration.objectString;
    const newObjectStr = oldObjectStr.replace(
      /id:\s*['"`][^'"`]+['"`]/,
      `id: '${migration.newId}'`
    );
    
    newContent = newContent.substring(0, migration.startIndex) + 
                newObjectStr + 
                newContent.substring(migration.endIndex);
  }
  
  // Write the updated content back to file
  fs.writeFileSync(filePath, newContent);
  
  return {
    totalWords: words.length,
    migrations: migrations,
    gradeCounters: gradeCounters
  };
}

/**
 * Main migration function
 */
function main() {
  console.log('🚀 Starting Vocabulary ID Migration to 7-digit format (CCNNNNN)');
  console.log('CC = Grade Code (01-09), NNNNN = Sequence (00001-99999)\n');
  
  const vocabularyFiles = [
    path.join(__dirname, '../src/data/vocabulary.ts'),
    path.join(__dirname, '../src/data/extendedVocabulary.ts'),
    path.join(__dirname, '../src/data/juniorHighVocabulary.ts')
  ];
  
  let totalMigrated = 0;
  const allMigrations = [];
  
  for (const filePath of vocabularyFiles) {
    if (fs.existsSync(filePath)) {
      try {
        const result = migrateVocabularyFile(filePath);
        totalMigrated += result.totalWords;
        allMigrations.push(...result.migrations);
        
        console.log(`✅ Successfully migrated ${result.totalWords} words in ${path.basename(filePath)}`);
        console.log(`   Grade distribution:`, result.gradeCounters);
      } catch (error) {
        console.error(`❌ Error migrating ${filePath}:`, error.message);
      }
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  }
  
  // Generate migration report
  const reportPath = path.join(__dirname, '../VOCABULARY_ID_MIGRATION_REPORT.md');
  const report = generateMigrationReport(allMigrations);
  fs.writeFileSync(reportPath, report);
  
  console.log(`\n🎉 Migration completed!`);
  console.log(`📊 Total words migrated: ${totalMigrated}`);
  console.log(`📄 Migration report saved to: ${reportPath}`);
}

/**
 * Generate migration report
 * @param {Array} migrations - Array of migration objects
 * @returns {string} Markdown report content
 */
function generateMigrationReport(migrations) {
  const gradeStats = {};
  
  for (const migration of migrations) {
    if (!gradeStats[migration.grade]) {
      gradeStats[migration.grade] = [];
    }
    gradeStats[migration.grade].push(migration);
  }
  
  let report = `# Vocabulary ID Migration Report\n\n`;
  report += `**Migration Date**: ${new Date().toISOString()}\n`;
  report += `**Total Words Migrated**: ${migrations.length}\n\n`;
  
  report += `## New 7-Digit ID Format\n\n`;
  report += `- Format: \`CCNNNNN\`\n`;
  report += `- CC: Grade classification (01-09)\n`;
  report += `- NNNNN: Sequential order within grade (00001-99999)\n\n`;
  
  report += `## Grade Distribution\n\n`;
  report += `| Grade | Code | Count | ID Range |\n`;
  report += `|-------|------|-------|----------|\n`;
  
  for (const [grade, words] of Object.entries(gradeStats)) {
    const gradeCode = GRADE_MAPPINGS[grade];
    const minId = Math.min(...words.map(w => w.newId));
    const maxId = Math.max(...words.map(w => w.newId));
    report += `| ${grade} | ${gradeCode} | ${words.length} | ${minId} - ${maxId} |\n`;
  }
  
  report += `\n## Detailed Migration Log\n\n`;
  
  for (const [grade, words] of Object.entries(gradeStats)) {
    report += `### ${grade.toUpperCase()}\n\n`;
    report += `| Old ID | New ID | Word |\n`;
    report += `|--------|--------|------|\n`;
    
    for (const word of words) {
      report += `| ${word.originalId} | ${word.newId} | ${word.word} |\n`;
    }
    report += `\n`;
  }
  
  return report;
}

// Run migration if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  migrateVocabularyFile,
  generateNewId,
  GRADE_MAPPINGS
};
