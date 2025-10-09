const userSessionModel = require("../Models/userSessioModel");

module.exports = function(io) {
    io.on("connection", (socket) => {
        console.log("🟢 User connected:", socket.id);

        socket.on("joinSession", async ({ sessionKey, username }) => {
            const session = await userSessionModel.findOne({ key: sessionKey });
            if (!session) return socket.emit("error", "Session not found");

            socket.join(`session-${sessionKey}`);
            console.log(`${username} joined session ${sessionKey}`);

            io.to(`session-${sessionKey}`).emit("userJoined", { username });

            socket.emit("sessionData", session.participants);
        });

        socket.on("leaveSession", async ({ sessionKey, username }) => {
            const session = await userSessionModel.findOne({ key: sessionKey });
            if (!session) return;

            socket.leave(`session-${sessionKey}`);
            console.log(`${username} left session ${sessionKey}`);

            io.to(`session-${sessionKey}`).emit("userLeft", { username });
        });

        socket.on("disconnect", () => {
            console.log("🔴 User disconnected:", socket.id);
        });
    });
};
