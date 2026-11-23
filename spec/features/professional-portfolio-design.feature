@ui
@requirements
@public
@done
@PORT-018
Feature: Professional portfolio visual design
  """
  Apply a restrained, job-search-focused visual system to the existing portfolio without rewriting its content or removing sections.
  """

  Background: User Story
    As a job seeker and technology leader
    I want to present my experience and AI knowledge in a professional, readable profile
    So that hiring leaders can assess my fit without sales-page distractions

  Scenario: Visitor sees a clear technology leader identity and existing profile content
    Given the portfolio has the established resume, leadership, and career content
    When a recruiter opens the homepage
    Then the wordmark identifies Brandon Houle as a Technology Leader and the existing sections remain available

  Scenario: Visitor finds the same How this was made content in a restrained visual style
    Given the portfolio has public requirements, quality evidence, and manual cases
    When a visitor opens How this was made
    Then the requirements grid, quality evidence, and manual case downloads remain available
