@done
@ci
@quality
@PORT-004
Feature: Integration test suite in CI
  """
  GitHub issue: https://github.com/brandonhoule1/portfolio/issues/4.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Integration checks exercise FSPEC data through public projection and evidence generation.
  #
  # EXAMPLES:
  #   1. A public-only catalog and associated check summary are generated from the repository work units.
  #
  # ========================================
  Background: User Story
    As a portfolio maintainer
    I want to verify that repository requirements and check results project into the built site
    So that data-to-site regressions are caught before publication

  Scenario: Public and internal records produce the expected requirement catalog
    Given the FSPEC repository contains explicitly public portfolio requirements and internal setup records
    When the static catalog and evidence report are built
    Then public requirements include their status and related links while internal records are omitted
