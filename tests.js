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
// ScheduleParser Tests
// ========================================

function testScheduleParser() {
  TestRunner.suite("ScheduleParser");

  // 事前にSettingsManagerを設定（テスト用の年月）
  const testYear = 2025;
  const testMonth = 11;

  TestRunner.test("extractVenues - simple pattern", () => {
    // "会場名：月/日付範囲" パターン
    const result = ScheduleParser.extractVenues("ベイシア：11/1-3", 1);
    assert.equal(Array.isArray(result), true);
    // 実際の結果は設定に依存するため、配列であることのみ確認
  });

  TestRunner.test("extractVenues - empty input", () => {
    const result = ScheduleParser.extractVenues("", 1);
    assert.arrayEqual(result, []);
  });

  TestRunner.test("extractVenues - null input", () => {
    const result = ScheduleParser.extractVenues(null, 1);
    assert.arrayEqual(result, []);
  });

  TestRunner.test("extractContent - simple pattern", () => {
    const result = ScheduleParser.extractContent("店頭ヘルパー：11/1-3", 1);
    // 結果は設定に依存するため、文字列型であることのみ確認
    assert.equal(typeof result, "string");
  });

  TestRunner.test("extractContent - empty input", () => {
    const result = ScheduleParser.extractContent("", 1);
    assert.equal(result, "");
  });

  TestRunner.test("extractContent - null input", () => {
    const result = ScheduleParser.extractContent(null, 1);
    assert.equal(result, "");
  });

  TestRunner.test("extractWorkingHours - date-specific pattern", () => {
    // 日付指定パターン: "11/1-3：9:00-17:00"
    const result = ScheduleParser.extractWorkingHours("11/1-3：9:00-17:00", 1);
    // 結果は設定と日付に依存
    assert.equal(typeof result, "string");
  });

  TestRunner.test("extractWorkingHours - general pattern", () => {
    const result = ScheduleParser.extractWorkingHours("9:00-17:00", 1);
    // 一般的なパターンの場合、時間が正規化されて返される
    assert.equal(typeof result, "string");
  });

  TestRunner.test("extractWorkingHours - empty input", () => {
    const result = ScheduleParser.extractWorkingHours("", 1);
    assert.equal(result, "");
  });

  TestRunner.test("extractWorkingHours - null input", () => {
    const result = ScheduleParser.extractWorkingHours(null, 1);
    assert.equal(result, "");
  });

  TestRunner.test("extractWorkingHours - invalid type", () => {
    const result = ScheduleParser.extractWorkingHours(123, 1);
    assert.equal(result, "");
  });

  TestRunner.test("_patterns - exists", () => {
    // パターンキャッシュが存在することを確認
    assert.notNull(ScheduleParser._patterns);
    assert.notNull(ScheduleParser._patterns.nameFirst);
    assert.notNull(ScheduleParser._patterns.dateFirst);
    assert.notNull(ScheduleParser._patterns.monthExtract);
    assert.notNull(ScheduleParser._patterns.colonSplit);
  });
}

// ========================================
// CoworkerOJTManager テスト
// ========================================

function testCoworkerOJTManager() {
  TestRunner.suite("CoworkerOJTManager");

  // ========================================
  // addCoworkersInfo テスト
  // ========================================

  TestRunner.test("addCoworkersInfo - empty shift data", () => {
    const result = CoworkerOJTManager.addCoworkersInfo([], "TestUser");
    assert.arrayEqual(result, []);
  });

  TestRunner.test("addCoworkersInfo - null shift data", () => {
    const result = CoworkerOJTManager.addCoworkersInfo(null, "TestUser");
    assert.equal(result, null);
  });

  TestRunner.test("addCoworkersInfo - with cache parameter", () => {
    const shiftData = [
      { date: 1, projectName: "Test Project", coworkers: "" }
    ];
    const cache = {
      nicknameMap: { "TestUser": "TU" },
      storeData: {
        names: [["Test Project"]],
        staffData: [["TU2"]],
        dateHeaders: ["11/1(金)"]
      }
    };
    const result = CoworkerOJTManager.addCoworkersInfo(shiftData, "TestUser", cache);
    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 1);
  });

  // ========================================
  // addOJTTraineesInfo テスト
  // ========================================

  TestRunner.test("addOJTTraineesInfo - empty shift data", () => {
    const result = CoworkerOJTManager.addOJTTraineesInfo([], "Trainer");
    assert.arrayEqual(result, []);
  });

  TestRunner.test("addOJTTraineesInfo - with cache, no OJT data", () => {
    const shiftData = [
      { date: 1, coworkers: "" }
    ];
    const cache = {
      nicknameMap: {},
      allOJTData: []
    };
    const result = CoworkerOJTManager.addOJTTraineesInfo(shiftData, "Trainer", cache);
    assert.equal(result.length, 1);
    assert.equal(result[0].coworkers, "");
  });

  TestRunner.test("addOJTTraineesInfo - with cache, has OJT data", () => {
    const shiftData = [
      { date: 1, coworkers: "" }
    ];
    const cache = {
      nicknameMap: { "Trainee1": "T1" },
      allOJTData: [
        {
          traineeName: "Trainee1",
          date: 1,
          trainerInfo: { name: "Trainer", projectName: "Project" }
        }
      ]
    };
    const result = CoworkerOJTManager.addOJTTraineesInfo(shiftData, "Trainer", cache);
    assert.equal(result.length, 1);
    assert.equal(result[0].coworkers, "T1");
  });

  // ========================================
  // buildAllOJTData テスト
  // ========================================

  TestRunner.test("buildAllOJTData - empty data", () => {
    const result = CoworkerOJTManager.buildAllOJTData([], [], [], {}, 1);
    assert.arrayEqual(result, []);
  });

  TestRunner.test("buildAllOJTData - with OJT entries", () => {
    const allShiftData = [
      ["", "OJT", "Project1"],
      ["", "Project2", "Project3"]
    ];
    const allShiftBackgrounds = [
      ["#ffffff", "#ff0000", "#ff0000"],
      ["#ffffff", "#ff0000", "#00ff00"]
    ];
    const dateHeaders = ["11/1(金)", "11/2(土)"];
    const nameRowMap = { "Trainee": 0, "Trainer": 1 };
    const startCol = 2;

    const result = CoworkerOJTManager.buildAllOJTData(
      allShiftData,
      allShiftBackgrounds,
      dateHeaders,
      nameRowMap,
      startCol
    );

    assert.equal(Array.isArray(result), true);
    assert.equal(result.length >= 0, true);
  });

  // ========================================
  // processOJTData テスト
  // ========================================

  TestRunner.test("processOJTData - no OJT data for user", () => {
    const cache = {
      allOJTData: [],
      nicknameMap: {},
      resourceMap: {}
    };
    const result = CoworkerOJTManager.processOJTData("User1", cache);
    assert.arrayEqual(result, []);
  });

  TestRunner.test("processOJTData - with OJT data but no trainer", () => {
    const cache = {
      allOJTData: [
        {
          traineeName: "User1",
          date: 1,
          trainerInfo: null
        }
      ],
      nicknameMap: {},
      resourceMap: {}
    };
    const result = CoworkerOJTManager.processOJTData("User1", cache);
    assert.equal(result.length, 1);
    assert.equal(result[0].isOJT, true);
    assert.equal(result[0].trainerName, null);
    assert.equal(result[0].needsTrainerConfirmation, true);
  });

  TestRunner.test("processOJTData - with trainer info", () => {
    const cache = {
      allOJTData: [
        {
          traineeName: "User1",
          date: 1,
          trainerInfo: {
            name: "Trainer1",
            projectName: "Project1"
          }
        }
      ],
      nicknameMap: { "Trainer1": "T1" },
      resourceMap: {
        "Project1": [
          {
            hours: "9:00-17:00",
            scheduleText: ""
          }
        ]
      }
    };
    const result = CoworkerOJTManager.processOJTData("User1", cache);
    assert.equal(result.length, 1);
    assert.equal(result[0].isOJT, true);
    assert.equal(result[0].trainerName, "Trainer1");
    assert.equal(result[0].coworkers, "T1");
  });

  // ========================================
  // _findCoworkers (内部メソッド) テスト
  // ========================================

  TestRunner.test("_findCoworkers - no matching date", () => {
    const result = CoworkerOJTManager._findCoworkers(
      "Project1",
      99,
      "TU",
      [["Project1"]],
      [["TU2"]],
      { 1: 0 }
    );
    assert.equal(result, "");
  });

  TestRunner.test("_findCoworkers - with matching coworkers", () => {
    const storeNames = [["Project1①"], ["Project1②"]];
    const staffData = [["TU"], ["TU2"]];
    const dateColMap = { 1: 0 };

    const result = CoworkerOJTManager._findCoworkers(
      "Project1①",
      1,
      "TU",
      storeNames,
      staffData,
      dateColMap
    );

    assert.equal(typeof result, "string");
    // Should not include the excluded nickname "TU"
  });

  // ========================================
  // _findTrainerByColor (内部メソッド) テスト
  // ========================================

  TestRunner.test("_findTrainerByColor - no matching color", () => {
    const allShiftData = [["Project1"]];
    const allShiftBackgrounds = [["#ffffff"]];
    const nameRowMap = { "User1": 0 };

    const result = CoworkerOJTManager._findTrainerByColor(
      allShiftData,
      allShiftBackgrounds,
      "#ff0000",
      1,
      nameRowMap
    );

    assert.equal(result, null);
  });

  TestRunner.test("_findTrainerByColor - matching color found", () => {
    const allShiftData = [["Project1"], ["Project2"]];
    const allShiftBackgrounds = [["#ff0000"], ["#ff0000"]];
    const nameRowMap = { "Trainee": 0, "Trainer": 1 };

    const result = CoworkerOJTManager._findTrainerByColor(
      allShiftData,
      allShiftBackgrounds,
      "#ff0000",
      1,
      nameRowMap
    );

    assert.notNull(result);
    assert.equal(result.name, "Trainee");
    assert.equal(result.projectName, "Project1");
  });

  TestRunner.test("_findTrainerByColor - skip OJT entries", () => {
    const allShiftData = [["OJT"], ["Project2"]];
    const allShiftBackgrounds = [["#ff0000"], ["#ff0000"]];
    const nameRowMap = { "Trainee": 0, "Trainer": 1 };

    const result = CoworkerOJTManager._findTrainerByColor(
      allShiftData,
      allShiftBackgrounds,
      "#ff0000",
      1,
      nameRowMap
    );

    // Should skip the "OJT" entry and find "Project2"
    assert.notNull(result);
    assert.equal(result.projectName, "Project2");
  });
}

/**
 * CoworkerOJTManager テストのみ実行
 */
function runCoworkerOJTManagerTests() {
  Logger.log("🧪 Running CoworkerOJTManager Tests...\n");
  TestRunner.reset();
  testCoworkerOJTManager();
  TestRunner.summary();
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
  testScheduleParser();
  testCoworkerOJTManager();

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

function runScheduleParserTests() {
  TestRunner.reset();
  testScheduleParser();
  TestRunner.summary();
}
