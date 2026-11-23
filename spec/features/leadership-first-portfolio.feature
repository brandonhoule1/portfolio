@ui
@public
@requirements
@done
@PORT-011
@PORT-012
@PORT-013
@PORT-014
@PORT-015
@PORT-016
Feature: Leadership-first portfolio experience
  """
  The portfolio makes Brandon's resume-backed leadership story primary and groups requirements, automated checks, and manual test cases in one How this was made experience. Demonstration inputs are labeled illustrative or synthetic.
  """

  Background: User Story
    As an executive, technology leader, or recruiter
    I want to understand Brandon's leadership and inspect career evidence
    So that I can assess fit and see how his approach works

  Scenario: Visitor opens the profile and sees the actual resume and adaptable 90-day plan
    Given the portfolio has been built with the canonical AI Enablement resume
    When a visitor opens the home page
    Then the profile, downloadable resume, career evidence, and illustrative first-90-days plan are available

  Scenario: Visitor finds requirements and quality evidence in one destination
    Given the portfolio has requirements and sanitized check results
    When a visitor opens How this was made
    Then the requirements grid, quality evidence, and manual test cases appear in one destination

  Scenario: Visitor downloads complete manual test cases
    Given manual cases cover positive, negative, data, integration, edge, usability, performance, and security paths
    When a visitor selects either test case download
    Then the file contains case identifiers, status, preconditions, steps, and expected results

  Scenario: Illustrative scenarios are distinguished from career evidence
    Given the portfolio includes synthetic organization examples
    When a visitor reads the leadership demonstrations
    Then synthetic examples and adaptable plans are labeled and are not attributed as achieved client outcomes
