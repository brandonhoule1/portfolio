@ci
@quality
@PORT-007
Feature: Single-pass performance checks
  """
  GitHub issue: https://github.com/brandonhoule1/portfolio/issues/7.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Performance checks make one page navigation per selected route and never generate concurrent load.
  #
  # EXAMPLES:
  #   1. The run records HTTP status and browser navigation timing for the home route once.
  #
  # ========================================
  Background: User Story
    As a portfolio maintainer
    I want to measure one navigation through a selected route
    So that I can spot obvious delivery regressions without generating load

  Scenario: One route pass records timing without generating load
    Given a performance check targets the home route
    When the browser performs its single navigation
    Then response status and navigation timings are recorded without concurrent or repeated requests
