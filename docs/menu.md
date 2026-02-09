# Journal System Menu Documentation

This document describes the menu structure of the Journal system, organized by user roles. All menu items are in English.

## Overview
The navigation menu is dynamically generated based on user permissions. For users with multiple roles (e.g., Administrator), the menu will display all relevant sections.

---

## Role-Based Menu Structure

### 1. Administrator / Journal Manager
*Users with elevated system access.*

- **Dashboard**: General overview of system stats.
- **Editorial** (Group):
    - **Manager Console**: Specific metrics for journal management.
    - **Submission Queue**: View and manage all incoming manuscripts.
    - **Issue Management**: Create and publish journal issues/volumes.
- **Access Control** (Group):
    - **Users**: Manage user accounts and profiles.
    - **Roles**: Define system roles (Admin, Editor, etc.).
    - **Permissions**: Granular control over system features.
    - **Menu Manager**: Customize the navigation menu items.
- **Settings** (Group):
    - **App Settings**: General journal configuration (Title, Email, etc.).
    - **Backup**: Database and file backup tools.
    - **Audit Logs**: Track system activity and user actions.
- **File Manager** (Group):
    - **My Files**: Personal file storage.
    - **Media**: Shared library for images and public assets.

### 2. Editor
*Users responsible for the peer-review process.*

- **Dashboard**: General overview.
- **Editorial** (Group):
    - **Editor Console**: Track manuscripts assigned to you.
    - **Submission Queue**: Review and assign reviewers to manuscripts.
    - **Issue Management**: Organize manuscripts into issues.

### 3. Reviewer
*Subject matter experts reviewing manuscripts.*

- **Dashboard**: General overview.
- **Editorial** (Group):
    - **Reviewer Dashboard**: Stats on your review performance.
    - **Reviewer Tasks**: List of active and completed review assignments.

### 4. Author
*Researchers submitting their work.*

- **Dashboard**: General overview.
- **Author Panel** (Group):
    - **My Submissions**: Track the status of your submitted manuscripts.
    - **New Submission**: Start the process of submitting a new paper.

### 5. Reader
*General users who browse and save bookmarks.*

- **Dashboard**: General overview.
- **Reader Library**: Access bookmarked articles and saved searches.

---

## Menu Optimizations
The following improvements were made to `MenuSeeder` to improve clarity and reduce redundancy:

1.  **Uniform English Names**: All menu labels are now strictly in English (e.g., "Library" instead of Indonesian terms).
2.  **Dashboard Consolidation**: To prevent confusion for users with multiple roles, specific dashboard screens are named as "Console" or specific types (Manager Console, Editor Console, Reviewer Dashboard) instead of multiple generic "Dashboard" labels.
3.  **Typo Fix**: "Previewer Tasks" has been corrected to **"Reviewer Tasks"**.
4.  **Logical Grouping**: Simplified group names like "Editorial" and "Access Control" to keep the navigation header concise.
