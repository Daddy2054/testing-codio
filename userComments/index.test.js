const expect = require('chai').expect;
const request = require('request');
const sinon = require('sinon');
const getCommentsById = require('./index');

describe('with Stub: getCommentsById', () => {
    before(() => {
        sinon.stub(request, 'get')
            .yields(null, null, JSON.stringify([
                {
                    "postId": 1,
                    "id": 1,
                    "name": "user1",
                    "email": "user1@fake.com",
                    "body": "lol"
                },
                 {
                    "postId": 1,
                    "id": 2,
                    "name": "user2",
                    "email": "user2@fake.com",
                    "body": "lollol"
                },
                {
                    "postId": 1,
                    "id": 3,
                    "name": "user3",
                    "email": "user3@fake.com",
                    "body": "lollollol"
                }
            ]));
    });

    after(() => {
        request.get.restore();
    });

    it('should getCommentsById', (done) => {
        getCommentsById(1).then((comments) => {
            expect(comments.length).to.equal(3);
            comments.forEach(comment => {
                expect(comment).to.have.property('id');
                expect(comment).to.have.property('name');
                expect(comment).to.have.property('email');
            });
            done();
        });
    });
});
