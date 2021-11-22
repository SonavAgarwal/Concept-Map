const testingdata = {
    name: "Testing Data Map",
    owner: "gygah354auotqyuwgr79b8aogihwnq8493gywae",
    creationTimestamp: "1i-q24th-90th24j",
    lastEditTimestamp: "9y82hefvshf98uhuowkjgrh",
    public: false,
    circles: [
        {
            id: "id1",
            type: "text",
            content: "This is the text",
            color: "#F111A1",
            x: 100,
            y: 150,
        },
        {
            id: "id2",
            type: "text",
            content: "a second thing",
            color: "#11F1A1",
            x: 200,
            y: 300,
        },
        {
            id: "id3",
            type: "image",
            content:
                "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
            color: "#1121F1",
            x: 400,
            y: 100,
        },
        {
            id: "id4",
            type: "image",
            content: "https://google.com",
            color: "#1121F1",
            x: 400,
            y: 600,
        },
    ],
    connections: [
        {
            id: "con-alsdjfwie",
            circles: ["id1", "id2"],
            text: "This is the text of the connection between a and b.",
        },
        {
            id: "con-gui3rrhovidn",
            circles: ["id3", "id2"],
            text: "This is the text of the connection between c and b.",
        },
    ],
};

export default testingdata;
