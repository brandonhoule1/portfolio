@ui
@requirements
@public
@PORT-002
Feature: Traceable public requirements catalog
  """
  The public catalog is a read-only projection of FSPEC work units and linked Gherkin acceptance criteria. Only PORT requirement records with a reviewed public marker are emitted. Render status, description, acceptance criteria, and related links as static content; exclude private records and execution logs.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Only requirements explicitly marked for public display are published; internal setup work is excluded.
  #   2. Each published requirement shows its current FSPEC status, description, acceptance criteria, and related requirements.
  #
  # EXAMPLES:
  #   1. A hiring leader opening the requirements page sees PORT-002 with its current status and acceptance criteria, while FOUND-001 remains private.
  #   2. When PORT-002 relates to PORT-006, the requirements page links both IDs without rendering unrelated setup records.
  #
  # ========================================
  Background: User Story
    As a hiring leader
    I want to inspect approved requirements and their status, description, acceptance criteria, and relationships
    So that understand the development approach without relying on a Jira-style workflow

  Scenario: Visitors inspect status, description, and acceptance criteria
    Given the public catalog contains a reviewed requirement PORT-002
    When a hiring leader opens the requirements page
    Then the page shows PORT-002 status, description, acceptance criteria, and related requirements

  Scenario: Internal work is excluded from the public catalog
    Given the repository contains public PORT requirements and internal foundation work
    When a visitor opens the requirements page
    Then the page lists marked PORT requirements and omits internal foundation work
