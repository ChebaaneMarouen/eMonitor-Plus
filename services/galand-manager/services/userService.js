module.exports = function({User}) {
  async function createNewUser(user) {
    const _user = new User(user);
    console.log(_user);
    const users = await User.get({email: _user.email});
    if (users.length > 0) throw new Error("MESSAGE_EMAIL_IS_ALREADY_RESERVED");

    return User.save({
      ...user,
      password: Math.random(),
      status: 0,
    });
  }

  function updateUser(oldUser, newUser) {
    Object.keys(newUser).forEach((key) => (oldUser[key] = newUser[key]));
    return oldUser.save();
  }

  function getUser(query) {
    return User.getOne(query);
  }

  function addUser(user) {
    const newUser = new User(user);
    return newUser.save();
  }

  function getUsers(query) {
    return User.get(query);
  }
  function deleteUser(query) {
    return User.remove(query);
  }

  return {
    getUser,
    addUser,
    getUsers,
    deleteUser,
    createNewUser,
    updateUser,
  };
};
