module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      user_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      jwt_token: {
        type: Sequelize.STRING
      },
      organization:{
        type:Sequelize.STRING,
        default:'self'
      },
      user_type: {
        type: Sequelize.ENUM("super_admin", "admin"),
        default: 'admin'
      }
    });
  
    return User;
  };
  