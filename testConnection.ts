import db from './db';
import * as schema from './dbSchema';

async function testConnection() {
 try {
   const users = await db.select().from(schema.users).execute();
   console.log('Usuários:', users);
 } catch (error) {
   console.error('Erro ao conectar ao banco de dados:', error);
 } finally {
   await db.$client.end(); // Usando $client.end() para PostgreSQL
 }
}

testConnection();