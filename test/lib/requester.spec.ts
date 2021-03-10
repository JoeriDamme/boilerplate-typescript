import Requester from '../../src/lib/requester';
import chai from 'chai';
const expect = chai.expect;

const logger = {
  debug: () => null,
  info: () => null,
  error: () => null,
} as any

describe('lib/requester', () => {

  describe('urlBuilder()', () => {
    it('should add a forward slash if it is ommited in url and path argument', () => {
      const url = 'http://zork.nl';
      const path = 'news';
      const requester = new Requester(url, { path }, logger);
      const result = requester.urlBuilder();

      expect(result).to.be.equal('http://zork.nl/news');
    });

    it('should not add a forward slash if it is ommited in url but not in path argument', () => {
      const url = 'http://zork.nl';
      const path = '/news';
      const requester = new Requester(url, { path }, logger);
      const result = requester.urlBuilder();

      expect(result).to.be.equal('http://zork.nl/news');
    });

    it('should not add a forward slash if it is not ommited in url but in path argument', () => {
      const url = 'http://zork.nl/';
      const path = 'news';
      const requester = new Requester(url, { path }, logger);
      const result = requester.urlBuilder();

      expect(result).to.be.equal('http://zork.nl/news');
    });
  });

});