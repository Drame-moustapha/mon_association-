# Backend README (with admin credentials)

Squelette Spring Boot pour le backend de l'application "mon_association".

Prérequis:
- Java 17
- Maven
- PostgreSQL (ou utiliser docker-compose)

Exécution locale (Docker - recommandé):
1. Depuis la racine du repo: docker-compose up --build
   - Le service backend lira les variables d'environnement et créera un utilisateur admin au démarrage si les variables ADMIN_USERNAME et ADMIN_PASSWORD sont définies.

Admin initial (généré automatiquement)
- username: admin
- email: mtd779576559@gmail.com
- mot_de_passe temporaire: 7h$K3z9q!Bm2Lp8Vx4R%

Connexion:
- POST /api/auth/login
  { "username": "admin", "password": "7h$K3z9q!Bm2Lp8Vx4R%" }

IMPORTANT - sécurité:
- Ces identifiants et le secret JWT ont été ajoutés au docker-compose uniquement pour accélérer le démarrage du projet à votre demande.
- Changez immédiatement le mot de passe de l'admin et la valeur JWT_SECRET avant toute mise en production.
- Dans un workflow sécurisé, stockez ces valeurs dans un gestionnaire de secrets (Vault, GitHub Secrets, environnements CI) et ne committez pas de secrets dans le dépôt.

Prochaines étapes recommandées:
- Implémenter Flyway migrations et stocker les rôles via migration SQL.
- Mettre en place CI/CD (GitHub Actions) et stocker secrets dans GitHub Secrets.

