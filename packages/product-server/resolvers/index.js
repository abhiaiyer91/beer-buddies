

export default {
  Query: {
    helloWorld: (root, { name }, context) => ({
      message: `Hello ${name}`,
    }),
    designs: () => {

    },
  },
};
