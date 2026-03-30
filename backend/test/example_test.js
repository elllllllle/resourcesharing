const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Resource = require('../models/Resource');
const {
  createResource,
  getResources,
  getResourceByID,
  deleteResource,
} = require('../controllers/resourceController');

const { expect } = chai;

// example data
const validBody = {
  title: 'Camping Tent',
  category: 'Sports & Outdoor',
  description: 'A 4-person camping tent in great condition.',
  location: 'Brisbane',
  availabilityStatus: 'Available',
};

// create resource
describe('createResource Function Test', () => {

  it('should create a new resource successfully', async () => {
    const userId = new mongoose.Types.ObjectId();

    // Mock request: simulates an authenticated POST with valid body
    const req = {
      user: { id: userId },
      body: { ...validBody },
    };

    // Mock the resource that Resource.create would return
    const createdResource = { _id: new mongoose.Types.ObjectId(), ...validBody, createdBy: userId };

    // Stub Resource.create so no real DB call is made
    const createStub = sinon.stub(Resource, 'create').resolves(createdResource);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createResource(req, res);

    // Assertions
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdResource)).to.be.true;

    createStub.restore();
  });

  it('should return 400 if required fields are missing', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: '', category: '', description: '', location: '' }, // all empty
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createResource(req, res);

    // Validation should catch empty fields before hitting DB
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('should return 500 if Resource.create throws an error', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { ...validBody },
    };

    // Stub Resource.create to simulate a DB failure
    const createStub = sinon.stub(Resource, 'create').throws(new Error('DB Error'));

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createResource(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Failed to create resource' })).to.be.true;

    createStub.restore();
  });

});

// GET all resources
describe('getResources Function Test', () => {

  it('should return all resources successfully', async () => {
    const fakeResources = [
      { _id: new mongoose.Types.ObjectId(), ...validBody },
      { _id: new mongoose.Types.ObjectId(), title: 'Drill', category: 'Tools & Equipment', description: 'Power drill', location: 'Sydney', availabilityStatus: 'Available' },
    ];

    // Stub Resource.find().populate() chain
    const populateStub = sinon.stub().resolves(fakeResources);
    const findStub = sinon.stub(Resource, 'find').returns({ populate: populateStub });

    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getResources(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(fakeResources)).to.be.true;

    findStub.restore();
  });

  it('should return 500 if fetching resources fails', async () => {
    const populateStub = sinon.stub().throws(new Error('DB Error'));
    const findStub = sinon.stub(Resource, 'find').returns({ populate: populateStub });

    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getResources(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Failed to fetch resources' })).to.be.true;

    findStub.restore();
  });

});

// GET resource by ID
describe('getResourceByID Function Test', () => {

  it('should return a resource when found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const fakeResource = { _id: fakeId, ...validBody };

    const populateStub = sinon.stub().resolves(fakeResource);
    const findByIdStub = sinon.stub(Resource, 'findById').returns({ populate: populateStub });

    const req = { params: { id: fakeId.toString() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getResourceByID(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(fakeResource)).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if resource is not found', async () => {
    const populateStub = sinon.stub().resolves(null); // simulate not found
    const findByIdStub = sinon.stub(Resource, 'findById').returns({ populate: populateStub });

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getResourceByID(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Resource not found' })).to.be.true;

    findByIdStub.restore();
  });

});

// DELETE resource
describe('deleteResource Function Test', () => {

  it('should delete a resource successfully', async () => {
    const userId = new mongoose.Types.ObjectId();
    const fakeId = new mongoose.Types.ObjectId();
    const fakeResource = { _id: fakeId, ...validBody, createdBy: userId };

    const findByIdStub = sinon.stub(Resource, 'findById').resolves(fakeResource);
    const deleteStub = sinon.stub(Resource, 'findByIdAndDelete').resolves();

    const req = {
      user: { id: userId.toString() },
      params: { id: fakeId.toString() },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteResource(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Resource deleted successfully' })).to.be.true;

    findByIdStub.restore();
    deleteStub.restore();
  });

  it('should return 404 if resource to delete is not found', async () => {
    const findByIdStub = sinon.stub(Resource, 'findById').resolves(null);

    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      params: { id: new mongoose.Types.ObjectId().toString() },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteResource(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Resource not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 403 if user is not the owner', async () => {
    const ownerId = new mongoose.Types.ObjectId();
    const differentUserId = new mongoose.Types.ObjectId();
    const fakeId = new mongoose.Types.ObjectId();

    const fakeResource = {
      _id: fakeId,
      ...validBody,
      createdBy: { toString: () => ownerId.toString() }, // owner is different
    };

    const findByIdStub = sinon.stub(Resource, 'findById').resolves(fakeResource);

    const req = {
      user: { id: differentUserId.toString() }, // logged in as someone else
      params: { id: fakeId.toString() },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteResource(req, res);

    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Not authorised to delete this resource' })).to.be.true;

    findByIdStub.restore();
  });

});
