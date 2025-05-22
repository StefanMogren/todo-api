import { Router } from 'express';
import { v4 as uuid } from 'uuid';

// GET - Logga ut inloggad användare
// URL: /api/auth/logout

// POST - Tar emot data i requestets body, jämför mot databasen och returnerar status baserat på utfall.
// URL: /api/auth/login
// Body: { "username" : [username], "password" : [password] }

// POST - Tar emot data i requestets body, kontrollerar att användaren inte redan finns, och returnerar status.
// URL: /api/auth/register
// Body: { "username" : [username], "password" : [password] }
