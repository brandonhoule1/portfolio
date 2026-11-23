@done
@ui
@quality
@PORT-006
Feature: Public quality evidence
  """
  The build generates a sanitized summary from check outcomes. Raw test output, Playwright traces, and detailed dependency records are retained in private CI artifacts only.
  """

  Background: User Story
    As a portfolio visitor
    I want to review the latest test and quality results
    So that I can see what was checked before a site release

  Scenario: Visitors inspect latest sanitized quality and test results
    Given the latest quality runner has completed
    When a visitor opens the quality evidence page
    Then the page shows check outcomes and summaries without exposing raw logs or traces
