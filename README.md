# awqlqb

[![NPM version][npm-image]][npm-url]

> AdWords Query Language query builder for JavaScript

A query builder that helps you simply make [AdWords Query String](https://developers.google.com/adwords/api/docs/guides/awql) to AdWords' [API](https://developers.google.com/adwords/api/docs/guides/start) for fetching data that you want.

## Install

```shell
$ yarn add awqlqb
```

```js
const AWQLQB = require('AWQLQB')
```

## Usage

### A basic example

```js
const AWQLQB = require('AWQLQB')

const awql = new AWQLQB()

const str = awql
  .select(['VideoId', 'Clicks'])
  .from('VIDEO_PERFORMANCE_REPORT')
  .where({ field: 'VideoId', operator: 'IN', value: ['1234'] })
  .during({ since: '20181001', until: '20181018' })
  .asAWQL()

console.log(str)

// SELECT VideoId, Clicks FROM VIDEO_PERFORMANCE_REPORT WHERE VideoId IN [1234] DURING 20181001, 20181018
```

## Note

Inspired by [FQB](https://github.com/chunkai1312/fqb)

## Reference

[AWQL Intoduction](https://developers.google.com/adwords/api/docs/guides/awql)

[npm-image]: https://img.shields.io/npm/v/awqlqb.svg
[npm-url]: https://npmjs.org/package/awqlqb
