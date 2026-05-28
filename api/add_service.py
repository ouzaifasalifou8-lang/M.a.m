import sys
import json
from db import execute_query

# Lecture des données envoyées depuis l'interface (via stdin)
input_data = sys.stdin.read()
data = json.loads(input_data)

# Insertion dans la base
sql = "INSERT INTO services (nom, prix) VALUES (?, ?)"
resultat = execute_query(sql, [data['nom'], data['prix']])

# Réponse pour le navigateur
print(json.dumps({"status": "success", "data": resultat}))
