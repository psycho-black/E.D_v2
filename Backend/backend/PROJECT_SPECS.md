# Ecosistema Digital Inteligente para Cirugía Especial (ECO-DIGITAL)

**Agency:** dogma.black
**Autor:** Salvador Aguilar
**Fecha:** Junio 2025

---

## 1. Cliente

**Dr. Joel Sánchez García.**

Médico Cirujano con más de 25 años de experiencia, especialista en Traumatología y Ortopedia y con Subespecialidad en Cirugía de la Columna Vertebral. Miembro de múltiples asociaciones nacionales e internacionales de prestigio.

---

## 2. Objetivo del Proyecto

Crear una plataforma digital integral para el consultorio del Dr. Joel Sánchez García que optimice la gestión de pacientes y la experiencia del usuario. La plataforma se diseñará con un enfoque en la **simplicidad, eficiencia y seguridad**, para que sea accesible para todo el personal, incluyendo pacientes mayores.

---

## 3. Dolores a Resolver

*   **Saturación de información:** Archivos físicos y digitales dispersos.
*   **Seguimiento ineficiente:** Falta de un registro de paciente centralizado.
*   **Procesos manuales lentos:** Búsqueda de expedientes, agendamiento.
*   **Riesgo clínico:** Atención a pacientes sin registro completo/actualizado.
*   **Falta de control de visitas.**
*   **Comunicaciones mejorables** con pacientes.
*   **Seguridad de datos:** Riesgo de acceso indebido a información sensible.
*   **Brecha tecnológica:** Dificultad de uso para algunos pacientes o personal.
*   **Baja exposición digital** del consultorio.
*   **Marca personal del Dr. por potenciar.**

---

## 4. Soluciones y Componentes del Ecosistema

### 4.1. Dashboard Administrativo (Núcleo del Sistema)

*   **Tipo:** Aplicación de Escritorio (PWA Híbrida con Nativefier).
*   **Funcionalidades Clave:**
    *   Gestión de Pacientes (CRUD, Historial).
    *   Gestión de Procedimientos/Cirugías.
    *   Gestión Documental (Subida, categorización, visualización).
    *   Búsqueda Avanzada.
    *   Agendamiento de Citas (Calendario).
    *   Reportes y Cuantificación de Visitas.
    *   Seguridad (Login, Roles, Borrado Suave).

### 4.2. Página Web Profesional

*   **Diseño:** "Luxury, Tech, Accesible".
*   **Frontend:** **Framer**.
*   **Funcionalidades:**
    *   Secciones informativas (Dr., Servicios, Filosofía, Contacto).
    *   Asistente Virtual (Bot) para FAQ y Agendamiento.
    *   Pasarela de Pagos (*Futuras Versiones*).

### 4.3. Aplicación Móvil para Pacientes

*   **Diseño:** "Luxury, Tech, Accesible".
*   **Funcionalidades:**
    *   Acceso a Registro Médico.
    *   Agendamiento de Citas.
    *   Material Educativo (Videos, Guías).
    *   Interfaz de Voz (Accesibilidad).
    *   Mensajería Segura.
    *   Pasarela de Pagos.

### 4.4. Aplicación Móvil para Personal

*   **Descripción:** Versión optimizada del Dashboard para dispositivos móviles.

### 4.5. Integración con WhatsApp

*   **Funcionalidades:**
    *   Bot para FAQ y Agendamiento.
    *   Notificaciones y Recordatorios.

---

## 5. Arquitectura y Plan de Despliegue (GCP)

### 5.1. Visión General

*   **Backend y Base de Datos:** Centralizados en **Google Cloud Platform (GCP)**.
*   **Frontend:** Desarrollado en **Framer**.

### 5.2. Arquitectura Detallada en GCP (Optimización de Costos)

*   **Base de Datos (Cloud SQL):**
    *   **Motor:** PostgreSQL.
    *   **Máquina:** `db-f1-micro` (1 vCPU compartida, 0.6 GB RAM).
    *   **Disponibilidad:** **ZONAL** (reduce costos a la mitad).
    *   **Caché:** Desactivada (`data_cache_enabled: false`).
    *   **Horario de Actividad:** Configurado para operar solo en horario de oficina (~450 horas/mes) para minimizar costos.

*   **Backend (Cloud Run):**
    *   **Entorno:** Contenedor **Docker** con **Node.js**.
    *   **Escalado:** Configurado para escalar a **cero instancias** (`min_instance_count: 0`) para no generar costos si no hay tráfico.

*   **Redes (Networking):**
    *   **Balanceador de Carga Global:** Para distribuir tráfico al backend y archivos estáticos.

*   **Almacenamiento:**
    *   **Cloud Storage:** Para archivos estáticos del frontend, documentos (PDFs, imágenes) y modelos de IA.
    *   **Artifact Registry:** Repositorio para la imagen de Docker del backend.

*   **Seguridad:**
    *   **Secret Manager:** Para gestionar de forma segura la contraseña de la base de datos y otras credenciales.
    *   **IAM (Identity and Access Management):** Para control de accesos y permisos entre servicios.

### 5.3. Estrategia de Inteligencia Artificial (IA)

*   **Fase Inicial:** API de AI Studio Provisional.
*   **Futuro:** Migración a **Gemini Nano**.

---

## 6. Presupuesto y Límites

*   **Presupuesto Límite Mensual:** **$2,000.00 MXN**.
*   **Alerta de Presupuesto:** **Configurar obligatoriamente antes de desplegar.**
*   **Costo Total Estimado (mensual):** ~$1,300 MXN.
    *   *Cloud SQL:* ~$150 - $200 MXN.
    *   *Cloud Storage (2 TB):* ~$915 MXN.
    *   *Otros (Balanceador de Carga, etc.):* ~$200 MXN.
*   **Límite de Almacenamiento:** 2 TB.
*   **Modelo:** Pago por uso.
*   **Optimización de Costos:** Apagado de servicios fuera del horario laboral (5 am - 11 pm).

---

## 7. Operaciones Manuales de la Base de Datos

En caso de emergencia o necesidad de acceso fuera del horario de oficina configurado, la instancia de Cloud SQL puede ser activada y desactivada manualmente.

**Comando para ENCENDER la instancia (ignorar horario):**
```bash
gcloud sql instances patch eco-digital-db-instance --activation-policy=ALWAYS
```

**Comando para APAGAR la instancia:**
```bash
gcloud sql instances patch eco-digital-db-instance --activation-policy=NEVER
```

**Nota:** Para regresar al modo de operación por horario, la forma más sencilla es re-aplicar la política de horario desde la interfaz web de Google Cloud Console.