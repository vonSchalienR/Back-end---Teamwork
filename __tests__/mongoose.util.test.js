const { multipleMongooseToObject, mongooseToObject } = require('../src/util/mongoose');

describe('mongoose helpers', () => {
    test('mongooseToObject returns plain object when document exists', () => {
        const doc = { toObject: jest.fn(() => ({ id: 1, name: 'test' })) };
        const result = mongooseToObject(doc);
        expect(doc.toObject).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ id: 1, name: 'test' });
    });

    test('mongooseToObject returns falsy value unchanged', () => {
        expect(mongooseToObject(null)).toBeNull();
        expect(mongooseToObject(undefined)).toBeUndefined();
    });

    test('multipleMongooseToObject maps array of docs', () => {
        const docs = [
            { toObject: jest.fn(() => ({ id: 1 })) },
            { toObject: jest.fn(() => ({ id: 2 })) },
        ];

        const result = multipleMongooseToObject(docs);

        expect(docs[0].toObject).toHaveBeenCalledTimes(1);
        expect(docs[1].toObject).toHaveBeenCalledTimes(1);
        expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });
});
