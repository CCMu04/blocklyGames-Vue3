const mediator = (function () {
    let topics = [], uuid = 0;

    function subscribe(topic, callback) {
        uuid++;
        topics[topic] = topics[topic]
            ? [...topics[topic], {callback, uuid}]
            : [{callback, uuid}];
    }

    function publish(topic, ...args) {
        if (topics[topic]) {
            topics[topic].map((item) => item.callback(...args));
        }
    }

    return {
        install: function (obj) {
            obj.uuid = uuid;
            obj.publish = publish;
            obj.subscribe = subscribe;
            return obj;
        },
    };
})();
export default mediator;
