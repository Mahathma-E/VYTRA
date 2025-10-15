// Compatibility re-export: ensure both .js and .jsx imports resolve to the same implementation
export * from './AuthContext.jsx';

// Note: The real implementation lives in AuthContext.jsx. Keeping this file lets consumers
// import without specifying the extension and prevents partial/accidental duplicates from
// causing runtime crashes.