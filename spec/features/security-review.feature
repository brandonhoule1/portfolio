@ci
@quality
@PORT-008
Feature: Security review suggestions
  """
  GitHub issue: https://github.com/brandonhoule1/portfolio/issues/8.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Automated dependency and source checks produce actionable, sanitized guidance.
  #
  # EXAMPLES:
  #   1. The dependency audit has zero high or critical findings and the source review finds no prohibited patterns.
  #
  # ========================================
  Background: User Story
    As a portfolio maintainer
    I want to review dependency and source security signals with practical suggestions
    So that preventable risk is reduced without publishing sensitive details

  Scenario: Security checks produce reviewable findings and suggestions
    Given source and dependencies are checked during the quality run
    When security results are published
    Then the site shows a sanitized summary and general owner-reviewable suggestions
