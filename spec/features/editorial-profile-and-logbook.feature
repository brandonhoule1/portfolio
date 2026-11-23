@ui
@requirements
@public
@PORT-019
@done
Feature: Editorial profile and development logbook
  """
  Present Brandon's factual professional record and writing in an editorial logbook, with provenance, repository history, and indexable metadata.
  """

  Background: User Story
    As a job seeker and technology leader
    I want to show factual leadership work in a distinctive editorial logbook with case studies, notes, and verifiable development history
    So that hiring leaders can inspect his experience and judgment without marketing language or generic AI visual styling

  Scenario: Visitor identifies Brandon and reaches him
    Given the public profile identifies its subject and contact details
    When a hiring leader opens the homepage
    Then Brandon's two-line role mark, website, and email are visible

  Scenario: Visitor sees an editorial logbook visual system
    Given the homepage uses text-led career content and the selected editorial direction
    When a visitor reads the profile and case notes
    Then display typography, fine rules, and unboxed case studies define the visual hierarchy

  Scenario: Visitor reads grounded career case studies and dated field notes
    Given the portfolio includes only resume-grounded career evidence
    When a visitor reads the case studies and field notes
    Then three case notes and dated, authored articles distinguish evidence from perspective

  Scenario: Visitor inspects the complete repository development history
    Given the build has access to the checked-out repository history
    When a visitor opens the development record
    Then every available commit shows its date, subject, and exact GitHub revision link
