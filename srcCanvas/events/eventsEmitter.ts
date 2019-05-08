import NanoEvents from 'nanoevents'

const emitter = new NanoEvents();

export default {
    emit(...args) {
        if (args[0] === undefined) {
            throw new Error('Can\'t "emit" undefined key');
        }
        emitter.emit(...args);
    },

    on(...args) {
        if (args[0] === undefined) {
            throw new Error('Can\'t subscribe to undefined key');
        }
        emitter.on(...args);
    },
};
