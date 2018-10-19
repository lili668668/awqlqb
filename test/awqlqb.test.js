import { expect } from 'chai'
import AWQLQB from '../src/awqlqb'

describe('AWQLQB', () => {
  describe('#constructor', () => {
    it('should create empty query object and filterRules array', () => {
      const awql = new AWQLQB()
      expect(awql).to.have.property('query').that.deep.equals({})
      expect(awql).to.have.property('filterRules').that.deep.equals([])
    })
  })

  describe('#select', () => {
    it('should add fields property in query object and return this', () => {
      const awql = new AWQLQB()
      const actual = awql.select(['Clicks'])
      expect(actual).to.equal(awql)
      expect(actual.query).to.have.property('fields').that.deep.equals(['Clicks'])
    })
  })

  describe('#from', () => {
    it('should add level property in query object and return this', () => {
      const awql = new AWQLQB()
      const actual = awql.from('REPORT')
      expect(actual).to.equal(awql)
      expect(actual.query).to.have.property('level').that.equals('REPORT')
    })
  })

  describe('#where', () => {
    it('should concat filterRules and return this', () => {
      const awql = new AWQLQB()
      const actual = awql.where({ field: 'VideoId', operator: 'IN', value: ['1234'] })
      expect(actual).to.equal(awql)
      expect(actual.filterRules).to.deep.include({ field: 'VideoId', operator: 'IN', values: ['1234'] })
    })

    it('should not concat filterRules when filtering value is empty, and then return this', () => {
      const awql = new AWQLQB()
      const actual = awql.where({ field: 'VideoId', operator: 'IN' })
      expect(actual).to.equal(awql)
      expect(actual.filterRules).to.not.include({ field: 'VideoId', operator: 'IN' })
    })
  })

  describe('#during', () => {
    it('should add timeRange property in query object and add since/until property in timeRange and return this', () => {
      const awql1 = new AWQLQB()
      const actual1 = awql1.during({ since: '2018-10-01', until: '2018-10-18' })
      expect(actual1).to.equal(awql1)
      expect(actual1.query).to.have.property('timeRange').that.deep.equals({ since: '20181001', until: '20181018' })

      const awql2 = new AWQLQB()
      const actual2 = awql2.during({ since: '2018-10-01' })
      expect(actual2).to.equal(awql2)
      expect(actual2.query).to.have.property('timeRange').that.deep.equals({ since: '20181001' })

      const awql3 = new AWQLQB()
      const actual3 = awql3.during({ until: '2018-10-01' })
      expect(actual3).to.equal(awql3)
      expect(actual3.query).to.have.property('timeRange').that.deep.equals({ until: '20181001' })

      const awql4 = new AWQLQB()
      const actual4 = awql4.during({})
      expect(actual4).to.equal(awql4)
      expect(actual4.query).not.to.have.property('timeRange')
    })
  })

  describe('#asAWQL', () => {
    it('should build a correct string', () => {
      const awql1 = new AWQLQB()
      const str1 = awql1.asAWQL()
      expect(str1).to.equal('')

      const awql2 = new AWQLQB()
      const str2 = awql2.select(['Clicks']).asAWQL()
      expect(str2).to.equal('SELECT Clicks ')

      const awql3 = new AWQLQB()
      const str3 = awql3.select(['Clicks']).from('REPORT').asAWQL()
      expect(str3).to.equal('SELECT Clicks FROM REPORT ')

      const awql4 = new AWQLQB()
      const str4 = awql4.select(['Clicks']).from('REPORT').where({ field: 'AdId', operator: 'IN', value: ['1234', '5678'] }).asAWQL()
      expect(str4).to.equal('SELECT Clicks FROM REPORT WHERE AdId IN [1234 , 5678] ')

      const awql5 = new AWQLQB()
      const str5 = awql5.select(['Clicks']).from('REPORT').where({ field: 'AdId', operator: 'IN', value: '1234' }).asAWQL()
      expect(str5).to.equal('SELECT Clicks FROM REPORT WHERE AdId IN 1234 ')

      const awql6 = new AWQLQB()
      const str6 = awql6.select(['Clicks']).from('REPORT').where({ field: 'AdId', operator: 'IN', value: '1234' }).during({ since: '2018-10-01', until: '2018-10-18' }).asAWQL()
      expect(str6).to.equal('SELECT Clicks FROM REPORT WHERE AdId IN 1234 DURING 20181001, 20181018 ')
    })
  })
})
