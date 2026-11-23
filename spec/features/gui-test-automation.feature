@ci
@quality
@PORT-005
Feature: Playwright GUI tests in CI
  """
  GitHub issue: https://github.com/brandonhoule1/portfolio/issues/5.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Browser checks verify requirements and quality evidence in Chromium before deployment.
  #
  # EXAMPLES:
  #   1. A visitor sees requirement status and the evidence summary after the static site is served.
  #
  # ========================================
  Background: User Story
    As a portfolio visitor
    I want to inspect the requirements and quality evidence pages in a browser
    So that I can confirm the public experience works as presented

  Scenario: Visitors can inspect the requirements and check results
    Given the static portfolio has been built and served
    When the browser tests open the requirements and evidence pages
    Then the requirements, acceptance criteria, GitHub issue, and check summaries are visible
