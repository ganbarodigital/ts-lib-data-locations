# CHANGELOG

## Introduction

This CHANGELOG tells you:

* when a release was made
* what is in each release

It also tells you what changes have been completed, and will be included in the next tagged release.

For each release, changes are grouped under these headings:

* _Backwards-Compatibility Breaks_: a list of any backwards-compatibility breaks
* _New_: a list of new features. If the feature came from a contributor via a PR, make sure you link to the PR and give them a mention here.
* _Fixes_: a list of bugs that have been fixed. If there's an issue for the bug, make sure you link to the GitHub issue here.
* _Dependencies_: a list of dependencies that have been added / updated / removed.
* _Tools_: a list of bundled tools that have been added / updated / removed.

## develop branch

The following changes have been completed, and will be included in the next tagged release.

### Backwards-Compatibility Breaks

### New

* DataLocations
  - Added `DataLocation` base class
* Error Handling
  - Added `PackageErrorTable` and `ERROR_TABLE`
* Filepaths
  - Added `NotAFilepathError`
  - Added `PathApi` to model NodeJS's `path` module
  - Added `isFilepath()` data guard
  - Added `mustBeFilepath()` data guarantee
  - Added `resolveFilepath()` data transform
  - Added `Filepath` value type
* IpPort
  - Added `IpPort` value type
  - Added `formatIpPortAsNumber()` formatter
  - Added `formatIpPortAsString()` formatter
* ParsedURL
  - Added `ParsedURL` dumb value type
* URLFormatOptions
  - Added `isPRURLFormatOptions()` type guard
  - Added `isURLFormatOptionsWithHostname()` type guard
  - Added `URLFormatOptions` dumb value type
  - Added `URLFormatOptionsWithHostname` dumb value type
  - Added `PRURLFormatOptions` dumb value type
  - Added `URLFormatOptionsWithPathname` dumb value type
  - Added `URLFormatOptionsWithSearch` dumb value type
  - Added `URLFormatOptionsWithHash` dumb value type
* URL
  - Added `buildURLHref()`
  - Added `isURLSearch()` data guard
  - Added `URL` value type

### Fixes

### Dependencies

### Tools

## v0.0.1

Released Monday, 1st January 2020.

### Backwards-Compatibility Breaks

### New

### Fixes

### Dependencies

### Tools
