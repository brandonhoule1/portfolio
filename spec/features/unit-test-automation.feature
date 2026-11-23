@done
@ci
@quality
@PORT-003
Feature: Unit test suite in CI
  """
  GitHub issue: https://github.com/brandonhoule1/portfolio/issues/3.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Unit checks are deterministic and run for pull requests and production branch updates.
  #
  # EXAMPLES:
  #   1. When a unit check fails, the quality workflow fails and retains machine-readable results.
  #
  # ========================================
  Background: User Story
    As a portfolio maintainer
    I want to run fast deterministic unit checks before merging
    So that regressions are caught early and failed quality cannot publish

  Scenario: Public catalog projection preserves source status
    Given a unit test provides public and internal work units
    When the catalog projection runs
    Then only explicitly public requirements are returned with their current status

  Scenario: HTML output escapes markup
    Given a requirement includes markup characters in its text
    When the catalog HTML is rendered
    Then markup characters are escaped before output
