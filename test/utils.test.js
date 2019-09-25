import chai from 'chai';
import spies from 'chai-spies';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Util from '../server/utils/utils';

const util = new Util();
chai.use(chaiHttp, spies);
const {
    expect
} = chai;

describe('Testing utility functions', () => {
    it('should test setSuccess', () => {
        sinon.spy(Util, 'setSuccess');
        Util.setSuccess(200, 'Successfully done something', {
            name: 'francis',
            age: 54
        });
        expect(Util.setSuccess.calledOnce).to.be.true;
    });

    it('should test setSuccess', () => {
        sinon.spy(Util, 'setError');
        Util.setError(400, 'An error has occured');
        expect(Util.setError.calledOnce).to.be.true;
    });

});
