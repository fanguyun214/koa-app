const userResolvers = {
  Query: {
    hello: () => 'Hello world!',
    userList: async (parent, args, { dataSources, auth }, info) => {
      return dataSources.UserAPI.getUsers(auth);
    },
  },
  Mutation: {
    login: async (parent, args, { dataSources }, info) => {
      return dataSources.UserAPI.userLogin(args);
    },
  },
};

export default userResolvers;
