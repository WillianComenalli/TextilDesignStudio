import db from './db.js';
import * as schema from './dbSchema.js';

async function testConnection() {
  try {
        const users = await db.select().from(schema.users).execute();
                    console.log('Usuários:', users);
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    } finally {
        await db.end();
    }
}

export default testConnection;

// If you want to run the function immediately when the file is imported
testConnection();