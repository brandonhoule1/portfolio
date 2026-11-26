@ui
@requirements
@PORT-021
@critical
Feature: Sharper people-centered portfolio pages
  """
  Keep the homepage concise, use separate pages for the first-90-days plan and interview-grounded case studies, remove Field Notes, and keep contact details private behind a server-side form.
  """

  Background: User Story
    As a hiring leader reviewing a technology portfolio
    I want to understand Brandon's people-centered AI operating approach, career evidence, and resume without wading through every detail at once
    So that I can decide quickly what to explore and trust that published claims and contact details are accurate

  Scenario: Homepage stays focused
    Given a hiring leader opens the portfolio homepage
    When they scan the opening section
    Then they see the people-first AI message, LinkedIn portrait, and resume download CTA
    And they can navigate to leadership, the first-90-days plan, case studies, blog, and contact
    And the detailed plan and case studies are not repeated on the homepage

  Scenario: Leadership plan and case studies have dedicated pages
    Given a visitor wants more detail about Brandon's approach and work
    When they open the first-90-days or case-studies page
    Then the first-90-days page presents an adaptable 30/60/90 plan
    And each phase has scannable bullets describing priorities, questions, and intended outputs
    And the plan includes distinct emphasis for AI enablement, quality engineering, and enterprise AI solutions
    And its day-90 outcomes distinguish observed evidence from assumptions about value
    And the case-studies page presents all three user-provided narratives with their evidence caveats

  Scenario: The AI and human responsibilities are consistent across the portfolio
    Given a visitor reads the homepage, leadership, AI enablement, AI perspective, or First 90 Days page
    When they read the page's main positioning or shared footer
    Then they understand that AI takes on routine work
    And they understand that people bring judgment, feeling, thinking, creativity, and decisions
    And the wording keeps people visibly responsible for human judgment and consequential decisions

  Scenario: Blog starts with an empty index
    Given Brandon has not published an article
    When a visitor opens the blog index
    Then the page says no articles are published yet
    And it does not display generated sample articles
    And Field Notes is absent from public navigation and build output

  Scenario: Contact details stay private
    Given a visitor wants to contact Brandon
    When they open the contact page or online resume
    Then they can use the contact form or LinkedIn
    And Brandon's personal email address and phone number are absent from public pages and the downloadable resume
    And the form reports that delivery is not configured until server-side mail settings exist
