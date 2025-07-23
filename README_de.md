# 🚀 Beschleunigte Auslieferung - Entwicklung einer End-to-End CI/CD-Pipeline

> Eine umfassende End-to-End CI/CD-Pipeline für eine moderne Node.js + React-Anwendung. Dieses Projekt automatisiert alles vom Code-Commit bis zur Bereitstellung in der Produktion und integriert Linting, Testing, Docker-Builds, Schwachstellenscans sowie progressive, sichere Deployments mit GitLab CI und Jenkins.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)![GitLab CI](https://img.shields.io/badge/GitLab%20CI-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white)![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)![Trivy](https://img.shields.io/badge/Trivy-00A499?style=for-the-badge&logo=trivy&logoColor=white)

---

## 🎯 Projektziel

Das Hauptziel dieses Projekts ist es, manuelle Bereitstellungsschritte zu eliminieren, menschliche Fehler zu reduzieren und die Entwicklungszyklen drastisch zu beschleunigen, während gleichzeitig eine einwandfreie Code-Qualität sichergestellt wird. Durch die Entwicklung einer robusten und automatisierten Pipeline können wir eine schnelle, vorhersagbare und sichere Softwareauslieferung erreichen.

---

## 📌 Hauptmerkmale

Diese Pipeline automatisiert jede kritische Phase des Software-Auslieferungszyklus:

*   **Automatisiertes Linting:** Erzwingt einen konsistenten Code-Stil (`ESLint`) und fängt Syntaxfehler frühzeitig ab.
*   **Abhängigkeitsprüfung:** Scannt mit `npm audit` nach Schwachstellen in den Projektabhängigkeiten.
*   **Strenge Unit-Tests:** Führt automatisch eine vollständige Suite von Unit-Tests (`Jest`) aus, um die Funktionalität zu validieren.
*   **Effiziente Erstellung von Docker-Images:** Containerisiert die Node.js- und React-Anwendungen in leichtgewichtige, portable Docker-Images.
*   **Automatisiertes Scannen auf Schwachstellen:** Integriert Container-Scans mit Tools wie **Trivy** oder **Snyk**, um Sicherheitslücken zu identifizieren, bevor sie die Produktion erreichen.
*   **Progressive, sichere Bereitstellungen:** Nutzt ein Multi-Umgebungs-Setup (Staging und Produktion) mit manuellen Freigaben für Produktions-Releases, um das Risiko zu minimieren.
*   **Flexibilität bei CI/CD-Werkzeugen:** Bietet Pipeline-as-Code-Konfigurationen für sowohl **GitLab CI** als auch **Jenkins**.

---

## 🛠️ Tech-Stack & Werkzeuge

| Kategorie | Werkzeug / Technologie | Zweck |
| :--- | :--- | :--- |
| **CI/CD** | GitLab CI, Jenkins | Pipeline-Orchestrierung |
| **Anwendung** | Node.js, React | Backend-API und Frontend-UI |
| **Container** | Docker | Anwendungs-Containerisierung |
| **Code-Qualität** | ESLint, Prettier | Linting und Code-Formatierung |
| **Testen** | Jest, React Testing Library | Unit- und Komponententests |
| **Sicherheit** | Trivy, Snyk, `npm audit` | Schwachstellenscans für Container & Abhängigkeiten |
| **Bereitstellung** | Docker Compose, Kubernetes (K8s) | Ausführen der Anwendung in Staging & Produktion |

---

## 🧩 Pipeline-Architektur

Die CI/CD-Pipeline ist eine Abfolge von automatisierten Stufen, die sicherstellt, dass jede Änderung validiert wird, bevor sie veröffentlicht wird.

`Entwickler pusht Code nach Git` → **Pipeline wird ausgelöst**
1.  **Lint & Test:** Der Code wird auf Stil geprüft (`linted`) und auf Korrektheit getestet. `npm audit` prüft die Abhängigkeiten.
2.  **Build:** Bei erfolgreichen Tests werden separate Docker-Images für das Frontend und Backend erstellt.
3.  **Scan:** Die neu erstellten Docker-Images werden auf bekannte Schwachstellen gescannt (z. B. mit Trivy).
4.  **Push:** Sichere Images werden in eine Container-Registry (z. B. Docker Hub, GitLab Registry) hochgeladen.
5.  **Deploy to Staging:** Die neue Version wird automatisch in einer Staging-Umgebung zur Überprüfung und für E2E-Tests bereitgestellt.
6.  **Deploy to Production:** Nach manueller Genehmigung wird dasselbe validierte Image in die Produktionsumgebung übernommen.


---

## ⚙️ Pipeline-Konfiguration

Nachfolgend finden Sie Beispielkonfigurationen für GitLab CI und Jenkins.

### Voraussetzungen

*   Eine Node.js- und React-Anwendung.
*   Ein Git-Repository, das auf GitLab oder GitHub gehostet wird.
*   Ein konfiguriertes CI/CD-Werkzeug: GitLab (mit Runnern) oder ein Jenkins-Server.
*   Eine Container-Registry (z. B. Docker Hub, GitLab Container Registry).
*   Bereitstellungsumgebungen (z. B. Server oder ein Kubernetes-Cluster).
*   **Geheimnisverwaltung:** Speichern Sie sensible Daten (`DOCKER_USER`, `DOCKER_PASS` usw.) als CI/CD-Variablen in GitLab oder als Credentials in Jenkins. **Schreiben Sie niemals Geheimnisse fest in den Code!**

### Beispiel: GitLab CI (`.gitlab-ci.yml`)

```yaml
stages:
  - lint-test
  - build
  - scan
  - deploy_staging
  - deploy_production

variables:
  IMAGE_BASE_NAME: $CI_REGISTRY_IMAGE/$CI_PROJECT_NAME
  IMAGE_TAG: $CI_COMMIT_SHORT_SHA

lint_test_job:
  stage: lint-test
  image: node:18-alpine
  script:
    - echo "Führe Linting und Tests aus..."
    # Backend
    - cd backend
    - npm ci
    - npm run lint
    - npm audit --audit-level=high
    - npm test
    # Frontend
    - cd ../frontend
    - npm ci
    - npm run lint
    - npm test

build_job:
  stage: build
  image: docker:20.10.16
  services:
    - docker:20.10.16-dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - echo "Erstelle Docker-Images..."
    # Backend-Image erstellen und pushen
    - docker build -f ./backend/Dockerfile -t $IMAGE_BASE_NAME-backend:$IMAGE_TAG ./backend
    - docker push $IMAGE_BASE_NAME-backend:$IMAGE_TAG
    # Frontend-Image erstellen und pushen
    - docker build -f ./frontend/Dockerfile -t $IMAGE_BASE_NAME-frontend:$IMAGE_TAG ./frontend
    - docker push $IMAGE_BASE_NAME-frontend:$IMAGE_TAG

scan_job:
  stage: scan
  image: aquasec/trivy:latest
  script:
    - echo "Scanne Docker-Images auf Schwachstellen..."
    # Backend-Image auf hohe und kritische Schwachstellen scannen
    - trivy image --exit-code 1 --severity HIGH,CRITICAL $IMAGE_BASE_NAME-backend:$IMAGE_TAG
    # Frontend-Image scannen
    - trivy image --exit-code 1 --severity HIGH,CRITICAL $IMAGE_BASE_NAME-frontend:$IMAGE_TAG

deploy_staging:
  stage: deploy_staging
  script:
    - echo "Stelle in Staging-Umgebung bereit..."
    # Fügen Sie hier Ihr Bereitstellungsskript für Staging hinzu (z. B. mit ssh, kubectl oder docker-compose)
  environment:
    name: staging
    url: https://staging.your-app.com
  only:
    - main # oder develop-Branch

deploy_production:
  stage: deploy_production
  script:
    - echo "Stelle in Produktionsumgebung bereit..."
    # Fügen Sie hier Ihr Bereitstellungsskript für die Produktion hinzu
  environment:
    name: production
    url: https://your-app.com
  when: manual # Manueller Auslöser zur Sicherheit
  only:
    - main
```

### Beispiel: Jenkins (`Jenkinsfile`)

```groovy
pipeline {
    agent any

    environment {
        REGISTRY = 'your-docker-registry/your-app'
        IMAGE_TAG = "build-${env.BUILD_ID}"
        REGISTRY_CREDENTIALS = 'your-registry-credentials-id'
    }

    stages {
        stage('Lint & Test') {
            steps {
                echo 'Führe Linting und Tests aus...'
                nodejs('nodejs18') {
                    dir('backend') {
                        sh 'npm ci'
                        sh 'npm run lint'
                        sh 'npm audit --audit-level=high'
                        sh 'npm test'
                    }
                    dir('frontend') {
                        sh 'npm ci'
                        sh 'npm run lint'
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "Erstelle Docker-Images..."
                    docker.withRegistry("https://${REGISTRY}", REGISTRY_CREDENTIALS) {
                        def backendImage = docker.build("${REGISTRY}-backend:${IMAGE_TAG}", "-f backend/Dockerfile ./backend")
                        backendImage.push()

                        def frontendImage = docker.build("${REGISTRY}-frontend:${IMAGE_TAG}", "-f frontend/Dockerfile ./frontend")
                        frontendImage.push()
                    }
                }
            }
        }

        stage('Scan Images') {
            steps {
                echo 'Scanne Images auf Schwachstellen...'
                sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${REGISTRY}-backend:${IMAGE_TAG}"
                sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${REGISTRY}-frontend:${IMAGE_TAG}"
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo 'Stelle in Staging-Umgebung bereit...'
                // Fügen Sie hier Ihr Bereitstellungsskript hinzu
            }
        }

        stage('Approve & Deploy to Production') {
            steps {
                input 'In Produktion bereitstellen?'
                echo 'Stelle in Produktionsumgebung bereit...'
                // Fügen Sie hier Ihr Bereitstellungsskript hinzu
            }
        }
    }
}
```

---

## 🌟 Warum dieses Projekt wichtig ist

Manuelle Bereitstellungen verursachen Ausfälle. Unentdeckte Fehler schaden den Benutzern. Langsame Releases töten die Innovation. Diese Pipeline ist eine Blaupause zur Minderung dieser Risiken durch:

*   **🔁 Automatisierung von Routineaufgaben:** Entwickler haben mehr Zeit, sich auf die Entwicklung von Features zu konzentrieren, anstatt auf Bereitstellungen.
*   **🛡️ Sicherstellung von Qualität & Sicherheit:** Aufbau eines Sicherheitsnetzes, das Probleme abfängt, bevor sie die Benutzer beeinträchtigen.
*   **🚀 Schnellere, sicherere und zuverlässigere Auslieferung:** Schaffung einer Hochgeschwindigkeits-Entwicklungskultur, die auf einer Grundlage von Vertrauen und Zuversicht aufbaut.

Bei diesem Projekt geht es nicht nur um Werkzeuge – es geht darum, eine moderne DevOps-Kultur zu implementieren, um bessere Software schneller zu entwickeln.

---

## 🤝 Mitwirken

Beiträge sind jederzeit willkommen! Bitte öffnen Sie ein Issue oder senden Sie einen Pull Request für Verbesserungen, Fehlerbehebungen oder Aktualisierungen der Dokumentation.

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.
