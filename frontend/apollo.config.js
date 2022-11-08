module.exports = {
    client: {
        includes: ["./src/**/*.tsx"],
        tagName: "gql",
        service: {
            name: 'uber_eat',
            url: 'http://localhost:1000/graphql'
        }
    }
};