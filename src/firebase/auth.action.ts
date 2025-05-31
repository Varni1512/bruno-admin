// authService.ts (NO Firebase - Local Only)

const localUsers = [
  {
    id: "1",
    email: "test@example.com",
    password: "123456", // 🔐 In production, hash this!
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "admin123",
  },
];

export const loginUser = async (userData: { email: string; password: string }) => {
  try {
    const user = localUsers.find((u) => u.email === userData.email);

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    if (user.password === userData.password) {
      return {
        success: true,
        message: "Login successful.",
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } else {
      return {
        success: false,
        message: "Incorrect password.",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Internal error during login.",
    };
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = localUsers.find((u) => u.id === id);
    if (user) {
      return { id: user.id, name: user.email };
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error getting user:", e);
    throw e;
  }
};

export const updateUserPassword = async (id: string, password: string) => {
  try {
    const userIndex = localUsers.findIndex((u) => u.id === id);
    if (userIndex !== -1) {
      localUsers[userIndex].password = password;
      console.log("Password updated.");
    } else {
      console.log("User not found.");
    }
  } catch (e) {
    console.error("Error updating user:", e);
    throw e;
  }
};
