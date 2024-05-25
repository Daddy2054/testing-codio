// CODE FREEZE BEGIN
const expect = require('chai').expect;
const request = require('request');
const sinon = require('sinon');
const getAddressById = require('./index');

describe('Testing with stub', () => {
    before(() => {
        sinon.stub(request, 'get')
            .yields(null, null, JSON.stringify(
                {
                    "street": "Runabout Court",
                    "suite": "Apt. 3325",
                    "city": "Arlington",
                    "zipcode": "08624",
                    "geo": {
                        "lat": "-35.1739",
                        "lng": "89.4191"
                    }
                }
            ));
    });

    after(() => {
        request.get.restore();
    });
    // CODE FREEZE END
    // WRITE YOUR CODE HERE
    it('should have 5 properties', (done) => {
        //this test case checks to see if the returned object has 5 properties.
        getAddressById(1).then((data) => {
            expect(data).to.have.property('street');
            expect(data).to.have.property('suite');
            expect(data).to.have.property('city');
            expect(data).to.have.property('zipcode');
            expect(data).to.have.property('geo');
        });
        done();
    });
    //    this test case checks to see if the object has the street, suite, city, zipcode, and geo properties.
    it('should have street, suite, city, zipcode, and geo', (done) => {
        getAddressById(1).then((data) => {
            expect(data).to.have.property('street');
            expect(data).to.have.property('suite');
            expect(data).to.have.property('city');
            expect(data).to.have.property('zipcode');
            expect(data).to.have.property('geo');
        });
        done();
    });
    //this test case checks to see if geo has two properties as a value.
    it('geo should have 2 properties', (done) => {
        getAddressById(1).then((data) => {
            expect(data.geo).to.have.property('lat');
            expect(data.geo).to.have.property('lng');
        });
        done();
    });
    //this test case checks to see if geo has the lat and lng properties.
    it('geo should have lat and lng', (done) => {
        getAddressById(1).then((data) => {
            expect(data.geo).to.have.property('lat');
            expect(data.geo).to.have.property('lng');
        });
        done();
    });


    //possible solution
    // it('should have 5 properties', (done) => {
    //     getAddressById(1).then((address) => {
    //         expect(address.length).to.equal(5);
    //     });
    //     done();
    // });

    // it('should have street, suite, city, zipcode, and geo', (done) => {
    //     getAddressById(1).then((address) => {
    //         expect(address).to.have.property('street');
    //         expect(address).to.have.property('suite');
    //         expect(address).to.have.property('city');
    //         expect(address).to.have.property('zipcode');
    //         expect(address).to.have.property('geo');
    //     });
    //     done();
    // });

    // it('geo should have 2 properties', (done) => {
    //     getAddressById(1).then((address) => {
    //         expect(address.geo.length).to.equal(2);
    //     });
    //     done();
    // });

    // it('geo should have lat and lng', (done) => {
    //     getAddressById(1).then((address) => {
    //         expect(address.geo).to.have.property('lat');
    //         expect(address.geo).to.have.property('lng');
    //     });
    //     done();
    // });
});

