# NAEK-Bot-Discord

Built with NodeJS, LowDB, and DiscordJS.

Features:
- Greetings / Goodbyes
- Rank Management
- Usable across multiple servers

Commands:
- `-website`: displays developer's website
- `-set-welcome-channel <channel id>`: sets channel to send welcome messages
- `-set-welcome-message <message>`: sets welcome message, use `<@user>` to denote a mention to the joining user
- `-set-welcome <enable/disable>`: enables or disables welcome messages
- `-set-goodbye-channel <channel id>`: sets channel to send goodbye messages
- `-set-goodbye-message <message>`: sets goodbye message, use `<@user>` to denote a mention to the joining user
- `-set-goodbye <enable/disable>`: enables or disables goodbye messages
- `-add-joinable-rank <rank name>`: adds a rank for users to join
- `-remove-joinable-rank <rank name>`: removes a rank for users to join
- `-join-rank <rank name>`: adds a rank to a user
- `-leave-rank <rank name>`: removes a rank from a user
- `-joinable-ranks`: shows joinable ranks
- `-db-refresh`: development command only, refreshes the guilds database entry
