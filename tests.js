/**
 * シフト転記システム - ユニットテストスイート
 *
 * Google Apps Script用のシンプルなテストフレームワーク実装
 *
 * 使用方法:
 * 1. Apps Scriptエディタで tests.js を追加
 * 2. メニューから実行: runAllTests()
 * 3. ログにテスト結果が出力されます
 */

// ========================================
// テストフレームワーク
// ========================================

/**
 * テストランナー
 */
const TestRunner = {
  results: [],
  currentSuite: "",

  /**
   * テストスイートを開始
   * @param {string} suiteName - スイート名
   */
  suite(suiteName) {
    this.currentSuite = suiteName;
    Logger.log(`\n========================================`);
    Logger.log(`📋 Test Suite: ${suiteName}`);
    Logger.log(`========================================`);
  },

  /**
   * 個別テストを実行
   * @param {string} testName - テスト名
   * @param {Function} testFn - テスト関数
   */
  test(testName, testFn) {
    try {
      testFn();
      this.results.push({
        suite: this.currentSuite,
        name: testName,
        passed: true
      });
      Logger.log(`✅ PASS: ${testName}`);
    } catch (error) {
      this.results.push({
        suite: this.currentSuite,
        name: testName,
        passed: false,
        error: error.message
      });
      Logger.log(`❌ FAIL: ${testName}`);
      Logger.log(`   Error: ${error.message}`);
    }
  },

  /**
   * テスト結果のサマリーを表示
   */
  summary() {
    Logger.log(`\n========================================`);
    Logger.log(`📊 Test Summary`);
    Logger.log(`========================================`);

    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;

    Logger.log(`Total: ${total} tests`);
    Logger.log(`Passed: ${passed} (${((passed / total) * 100).toFixed(1)}%)`);
    Logger.log(`Failed: ${failed}`);

    if (failed > 0) {
      Logger.log(`\n❌ Failed Tests:`);
      this.results.filter(r => !r.passed).forEach(r => {
        Logger.log(`  • ${r.suite} > ${r.name}`);
        Logger.log(`    ${r.error}`);
      });
    }

    Logger.log(`\n${failed === 0 ? '🎉 All tests passed!' : '⚠️ Some tests failed'}`);
  },

  /**
   * テスト結果をリセット
   */
  reset() {
    this.results = [];
    this.currentSuite = "";
  }
};

/**
 * アサーション関数
 */
const assert = {
  /**
   * 値が真であることを検証
   */
  isTrue(value, message = "Expected true") {
    if (value !== true) {
      throw new Error(`${message}: got ${value}`);
    }
  },

  /**
   * 値が偽であることを検証
   */
  isFalse(value, message = "Expected false") {
    if (value !== false) {
      throw new Error(`${message}: got ${value}`);
    }
  },

  /**
   * 2つの値が等しいことを検証
   */
  equal(actual, expected, message = "Values should be equal") {
    if (actual !== expected) {
      throw new Error(`${message}: expected ${expected}, got ${actual}`);
    }
  },

  /**
   * 2つの値が等しくないことを検証
   */
  notEqual(actual, expected, message = "Values should not be equal") {
    if (actual === expected) {
      throw new Error(`${message}: both values are ${actual}`);
    }
  },

  /**
   * 配列が等しいことを検証
   */
  arrayEqual(actual, expected, message = "Arrays should be equal") {
    if (!Array.isArray(actual) || !Array.isArray(expected)) {
      throw new Error(`${message}: both must be arrays`);
    }
    if (actual.length !== expected.length) {
      throw new Error(`${message}: length mismatch (${actual.length} vs ${expected.length})`);
    }
    for (let i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) {
        throw new Error(`${message}: mismatch at index ${i} (${actual[i]} vs ${expected[i]})`);
      }
    }
  },

  /**
   * 値がnullまたはundefinedでないことを検証
   */
  notNull(value, message = "Value should not be null/undefined") {
    if (value === null || value === undefined) {
      throw new Error(`${message}`);
    }
  },

  /**
   * 値がnullまたはundefinedであることを検証
   */
  isNull(value, message = "Value should be null/undefined") {
    if (value !== null && value !== undefined) {
      throw new Error(`${message}: got ${value}`);
    }
  },

  /**
   * 文字列に部分文字列が含まれることを検証
   */
  includes(str, substring, message = "String should include substring") {
    if (typeof str !== 'string' || str.indexOf(substring) === -1) {
      throw new Error(`${message}: "${str}" does not include "${substring}"`);
    }
  },

  /**
   * 関数がエラーをスローすることを検証
   */
  throws(fn, message = "Function should throw an error") {
    let threw = false;
    try {
      fn();
    } catch (error) {
      threw = true;
    }
    if (!threw) {
      throw new Error(message);
    }
  }
};

// ========================================
// DateUtils Tests
// ========================================

function testDateUtils() {
  TestRunner.suite("DateUtils");

  TestRunner.test("expandDatesFromRange - single date", () => {
    const result = DateUtils.expandDatesFromRange("11/15");
    assert.arrayEqual(result, [15]);
  });

  TestRunner.test("expandDatesFromRange - date range with hyphen", () => {
    const result = DateUtils.expandDatesFromRange("11/1-3");
    assert.arrayEqual(result, [1, 2, 3]);
  });

  TestRunner.test("expandDatesFromRange - date range with wave dash", () => {
    const result = DateUtils.expandDatesFromRange("11/5〜7");
    assert.arrayEqual(result, [5, 6, 7]);
  });

  TestRunner.test("expandDatesFromRange - multiple dates with comma", () => {
    const result = DateUtils.expandDatesFromRange("11/1,3,5");
    assert.arrayEqual(result, [1, 3, 5]);
  });

  TestRunner.test("expandDatesFromRange - mixed range and single", () => {
    const result = DateUtils.expandDatesFromRange("11/1-3,5,7-9");
    assert.arrayEqual(result, [1, 2, 3, 5, 7, 8, 9]);
  });

  TestRunner.test("expandDatesFromRange - with Japanese comma", () => {
    const result = DateUtils.expandDatesFromRange("11/1、2、3");
    assert.arrayEqual(result, [1, 2, 3]);
  });

  TestRunner.test("expandDatesFromRange - with middle dot", () => {
    const result = DateUtils.expandDatesFromRange("10/1-3・5-7");
    assert.arrayEqual(result, [1, 2, 3, 5, 6, 7]);
  });

  TestRunner.test("expandDatesFromRange - invalid format", () => {
    const result = DateUtils.expandDatesFromRange("invalid");
    assert.arrayEqual(result, []);
  });

  TestRunner.test("expandDatesFromRange - empty string", () => {
    const result = DateUtils.expandDatesFromRange("");
    assert.arrayEqual(result, []);
  });

  TestRunner.test("expandDatesFromRange - null input", () => {
    const result = DateUtils.expandDatesFromRange(null);
    assert.arrayEqual(result, []);
  });

  TestRunner.test("extractDay - from Date object", () => {
    const date = new Date(2025, 10, 15); // 2025/11/15
    const result = DateUtils.extractDay(date);
    assert.equal(result, 15);
  });

  TestRunner.test("extractDay - from string M/D", () => {
    const result = DateUtils.extractDay("11/15");
    assert.equal(result, 15);
  });

  TestRunner.test("extractDay - invalid input", () => {
    const result = DateUtils.extractDay("invalid");
    assert.isNull(result);
  });
}

// ========================================
// StringUtils Tests
// ========================================

function testStringUtils() {
  TestRunner.suite("StringUtils");

  TestRunner.test("normalizeTimeFormat - hyphen to wave dash", () => {
    const result = StringUtils.normalizeTimeFormat("9:00-17:00");
    assert.equal(result, "9:00〜17:00");
  });

  TestRunner.test("normalizeTimeFormat - tilde to wave dash", () => {
    const result = StringUtils.normalizeTimeFormat("10:00~18:00");
    assert.equal(result, "10:00〜18:00");
  });

  TestRunner.test("extractBaseName - remove number symbols", () => {
    const result = StringUtils.extractBaseName("テラス湘南①");
    assert.equal(result, "テラス湘南");
  });

  TestRunner.test("extractBaseName - multiple number symbols", () => {
    const result = StringUtils.extractBaseName("イオンモール②③");
    assert.equal(result, "イオンモール");
  });

  TestRunner.test("extractBaseName - no number symbols", () => {
    const result = StringUtils.extractBaseName("ベイシア");
    assert.equal(result, "ベイシア");
  });

  TestRunner.test("preprocessName - remove parentheses prefix", () => {
    const result = StringUtils.preprocessName("(退職)山田太郎");
    assert.equal(result, "山田太郎");
  });

  TestRunner.test("preprocessName - full-width parentheses", () => {
    const result = StringUtils.preprocessName("（研修）鈴木花子");
    assert.equal(result, "鈴木花子");
  });

  TestRunner.test("preprocessName - trim spaces", () => {
    const result = StringUtils.preprocessName("  佐藤次郎  ");
    assert.equal(result, "佐藤次郎");
  });

  TestRunner.test("cleanContentText - remove venue name after colon", () => {
    const result = StringUtils.cleanContentText("店頭ヘルパー：イオンモール");
    assert.equal(result, "店頭ヘルパー");
  });

  TestRunner.test("cleanContentText - remove person count", () => {
    const result = StringUtils.cleanContentText("軒先販売 3名");
    assert.equal(result, "軒先販売");
  });

  TestRunner.test("cleanContentText - remove plus suffix", () => {
    const result = StringUtils.cleanContentText("店頭ヘルパー＋場所代");
    assert.equal(result, "店頭ヘルパー");
  });

  TestRunner.test("cleanVenueText - similar to cleanContentText", () => {
    const result = StringUtils.cleanVenueText("イオンモール：2階");
    assert.equal(result, "イオンモール");
  });

  TestRunner.test("truncate - string longer than max", () => {
    const result = StringUtils.truncate("長いテキストです", 5);
    assert.equal(result, "長いテキ...");
  });

  TestRunner.test("truncate - string shorter than max", () => {
    const result = StringUtils.truncate("短い", 10);
    assert.equal(result, "短い");
  });

  TestRunner.test("isEmpty - empty string", () => {
    const result = StringUtils.isEmpty("");
    assert.isTrue(result);
  });

  TestRunner.test("isEmpty - whitespace only", () => {
    const result = StringUtils.isEmpty("  ");
    assert.isTrue(result);
  });

  TestRunner.test("isEmpty - non-empty string", () => {
    const result = StringUtils.isEmpty("text");
    assert.isFalse(result);
  });

  TestRunner.test("unique - remove duplicates", () => {
    const result = StringUtils.unique(["A", "B", "A", "C", "B"]);
    assert.arrayEqual(result, ["A", "B", "C"]);
  });

  TestRunner.test("normalizeWhitespace - multiple spaces", () => {
    const result = StringUtils.normalizeWhitespace("複数  の　　空白");
    assert.equal(result, "複数 の 空白");
  });

  TestRunner.test("normalizeWhitespace - newlines", () => {
    const result = StringUtils.normalizeWhitespace("改行\n\nあり");
    assert.equal(result, "改行 あり");
  });

  TestRunner.test("removeLeadingBullets - bullet point", () => {
    const result = StringUtils.removeLeadingBullets("・イオンモール");
    assert.equal(result, "イオンモール");
  });

  TestRunner.test("removeLeadingBullets - filled bullet", () => {
    const result = StringUtils.removeLeadingBullets("•ベイシア");
    assert.equal(result, "ベイシア");
  });

  TestRunner.test("removeLeadingBullets - no bullet", () => {
    const result = StringUtils.removeLeadingBullets("テラス湘南");
    assert.equal(result, "テラス湘南");
  });

  TestRunner.test("extractDaysFromDateRange - normal format", () => {
    const result = StringUtils.extractDaysFromDateRange("11/1-3");
    assert.equal(result, "1-3");
  });

  TestRunner.test("extractDaysFromDateRange - with comma", () => {
    const result = StringUtils.extractDaysFromDateRange("12/15,20");
    assert.equal(result, "15,20");
  });

  TestRunner.test("extractDaysFromDateRange - invalid format", () => {
    const result = StringUtils.extractDaysFromDateRange("invalid");
    assert.equal(result, "");
  });

  TestRunner.test("splitByDateDelimiters - comma", () => {
    const result = StringUtils.splitByDateDelimiters("1,2,3");
    assert.arrayEqual(result, ["1", "2", "3"]);
  });

  TestRunner.test("splitByDateDelimiters - Japanese comma", () => {
    const result = StringUtils.splitByDateDelimiters("1、2、3");
    assert.arrayEqual(result, ["1", "2", "3"]);
  });

  TestRunner.test("splitByDateDelimiters - middle dot", () => {
    const result = StringUtils.splitByDateDelimiters("1・2・3");
    assert.arrayEqual(result, ["1", "2", "3"]);
  });

  TestRunner.test("getBeforeColon - full-width colon", () => {
    const result = StringUtils.getBeforeColon("店頭ヘルパー：イオン");
    assert.equal(result, "店頭ヘルパー");
  });

  TestRunner.test("getBeforeColon - half-width colon", () => {
    const result = StringUtils.getBeforeColon("ベイシア:11/1-3");
    assert.equal(result, "ベイシア");
  });

  TestRunner.test("getBeforeColon - no colon", () => {
    const result = StringUtils.getBeforeColon("テラス湘南");
    assert.equal(result, "テラス湘南");
  });
}

// ========================================
// ConfigManager Tests
// ========================================

function testConfigManager() {
  TestRunner.suite("ConfigManager");

  TestRunner.test("set and get - string value", () => {
    ConfigManager.set("TEST_KEY", "test_value");
    const result = ConfigManager.get("TEST_KEY");
    assert.equal(result, "test_value");
    // Cleanup
    PropertiesService.getScriptProperties().deleteProperty("TEST_KEY");
  });

  TestRunner.test("get with default - key exists", () => {
    ConfigManager.set("TEST_KEY2", "actual_value");
    const result = ConfigManager.get("TEST_KEY2", "default_value");
    assert.equal(result, "actual_value");
    // Cleanup
    PropertiesService.getScriptProperties().deleteProperty("TEST_KEY2");
  });

  TestRunner.test("get with default - key not exists", () => {
    const result = ConfigManager.get("NON_EXISTENT_KEY", "default_value");
    assert.equal(result, "default_value");
  });

  TestRunner.test("isDebugMode - default false", () => {
    // Ensure no debug mode is set
    PropertiesService.getScriptProperties().deleteProperty("DEBUG_MODE");
    const result = ConfigManager.isDebugMode();
    assert.isFalse(result);
  });

  TestRunner.test("setDebugMode and isDebugMode", () => {
    ConfigManager.setDebugMode(true);
    assert.isTrue(ConfigManager.isDebugMode());

    ConfigManager.setDebugMode(false);
    assert.isFalse(ConfigManager.isDebugMode());

    // Cleanup
    PropertiesService.getScriptProperties().deleteProperty("DEBUG_MODE");
  });

  TestRunner.test("getEnvironment - default value", () => {
    PropertiesService.getScriptProperties().deleteProperty("ENVIRONMENT");
    const result = ConfigManager.getEnvironment();
    assert.equal(result, "production");
  });
}

// ========================================
// ErrorHandler Tests
// ========================================

function testErrorHandler() {
  TestRunner.suite("ErrorHandler");

  TestRunner.test("record and getErrors", () => {
    // Clear existing errors
    ErrorHandler.clearErrors();

    // Record test error
    ErrorHandler.record(new Error("Test error"), "Test context", {key: "value"});

    const errors = ErrorHandler.getErrors(1);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].message, "Test error");
    assert.equal(errors[0].context, "Test context");

    // Cleanup
    ErrorHandler.clearErrors();
  });

  TestRunner.test("clearErrors", () => {
    ErrorHandler.record(new Error("Error 1"), "Context 1");
    ErrorHandler.record(new Error("Error 2"), "Context 2");

    ErrorHandler.clearErrors();

    const errors = ErrorHandler.getErrors(10);
    assert.equal(errors.length, 0);
  });

  TestRunner.test("handle - logs error", () => {
    // This test just ensures handle doesn't throw
    ErrorHandler.handle(new Error("Test error"), "Test context");
    // If we reach here, test passes
    assert.isTrue(true);
  });
}

// ========================================
// StoreNameMaster Tests
// ========================================

function testStoreNameMaster() {
  TestRunner.suite("StoreNameMaster");

  // キャッシュをクリアしてテスト開始
  StoreNameMaster.clearCache();

  TestRunner.test("getData - returns object", () => {
    const data = StoreNameMaster.getData();
    assert.notNull(data);
    // データはオブジェクトである
    assert.equal(typeof data, "object");
  });

  TestRunner.test("getOfficialName - null input", () => {
    const result = StoreNameMaster.getOfficialName(null);
    assert.isNull(result);
  });

  TestRunner.test("getOfficialName - empty string", () => {
    const result = StoreNameMaster.getOfficialName("");
    assert.isNull(result);
  });

  TestRunner.test("exists - with null", () => {
    const result = StoreNameMaster.exists(null);
    assert.isFalse(result);
  });

  TestRunner.test("getCount - returns number", () => {
    const count = StoreNameMaster.getCount();
    assert.equal(typeof count, "number");
    // カウントは0以上
    assert.isTrue(count >= 0);
  });

  TestRunner.test("clearCache - does not throw", () => {
    // キャッシュクリアがエラーを投げないことを確認
    StoreNameMaster.clearCache();
    assert.isTrue(true);
  });

  TestRunner.test("getData - caching works", () => {
    // 1回目の呼び出し
    const data1 = StoreNameMaster.getData();
    // 2回目の呼び出し（キャッシュから取得されるはず）
    const data2 = StoreNameMaster.getData();
    // 同じオブジェクト参照であることを確認
    assert.equal(data1, data2);
  });

  TestRunner.test("clearCache and getData - refreshes cache", () => {
    const data1 = StoreNameMaster.getData();
    StoreNameMaster.clearCache();
    const data2 = StoreNameMaster.getData();
    // キャッシュクリア後は異なるオブジェクト参照
    assert.notEqual(data1, data2);
  });
}

// ========================================
// メインテスト実行関数
// ========================================

/**
 * すべてのテストを実行
 * メニューまたはスクリプトエディタから実行
 */
function runAllTests() {
  Logger.log("🚀 Starting Unit Tests...\n");

  TestRunner.reset();

  // 各テストスイートを実行
  testDateUtils();
  testStringUtils();
  testConfigManager();
  testErrorHandler();
  testStoreNameMaster();

  // サマリーを表示
  TestRunner.summary();

  Logger.log("\n✨ Test execution completed!");
}

/**
 * 特定のテストスイートのみ実行
 */
function runDateUtilsTests() {
  TestRunner.reset();
  testDateUtils();
  TestRunner.summary();
}

function runStringUtilsTests() {
  TestRunner.reset();
  testStringUtils();
  TestRunner.summary();
}

function runConfigManagerTests() {
  TestRunner.reset();
  testConfigManager();
  TestRunner.summary();
}

function runErrorHandlerTests() {
  TestRunner.reset();
  testErrorHandler();
  TestRunner.summary();
}

function runStoreNameMasterTests() {
  TestRunner.reset();
  testStoreNameMaster();
  TestRunner.summary();
}
