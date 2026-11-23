@ui
@requirements
@public
@done
@PORT-017
Feature: LinkedIn profile portrait on homepage
  """
  Use the profile image exposed by Brandon's connected LinkedIn profile in RobinReach and retain the people, practice, and AI leadership diagram.
  """

  Background: User Story
    As a portfolio visitor
    I want to see Brandon's LinkedIn profile portrait beside the leadership diagram
    So that I connect the portfolio with the professional identity I recognize

  Scenario: Homepage shows Brandon's sourced portrait and leadership diagram
    Given the connected LinkedIn profile photo is included in the site build
    When a visitor opens the homepage
    Then Brandon's portrait has meaningful alternative text and the original leadership diagram remains visible
