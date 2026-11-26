@ui
@requirements
@PORT-025
Feature: Add role-specific leadership perspectives
  """
  Architecture notes:
  - Extend the existing Leadership page source; use shared site navigation and typography.
  - Place the role perspectives after the career record and before the governance starter.
  - Keep each lens to a short heading, framing sentence, and people-centered bullets; no new route or navigation item.
  - Draw facts only from the existing resume/case narratives. Label future-facing statements as a proposed approach.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Keep the three role lenses concise and on the existing Leadership page; do not add a new navigation item or employer-specific page.
  #   2. Label future-facing content as how Brandon would approach the role; distinguish it from documented work and outcomes.
  #   3. Center the perspectives on reducing friction for people, building on useful existing capability, and keeping consequential judgment with accountable people.
  #   4. Discuss evaluating outcomes, operating costs, and how employees use reclaimed time as proposed leadership intent; do not imply a real dashboard, measured savings, or completed implementation.
  #   5. Use only supported portfolio facts; do not claim scaled developer infrastructure, formal Staff+ coaching, healthcare domain experience, or other unverified qualifications.
  #
  # EXAMPLES:
  #   1. A visitor can scan a short AI enablement section and understand that the starting point is employee friction and useful existing practices, with developer experience and learning in view.
  #   2. A visitor can scan a quality engineering section and see AI framed as widening test considerations while people remain accountable for what evidence means and whether a release is ready.
  #   3. A visitor can scan an AI solutions leadership section and see attention to opportunity selection, incubation choices, delivery through sustainment, and honest outcome/cost learning without step-by-step instructions.
  #   4. When the acquisition case study is referenced, the documented Day 1 delivery and restoration before Day 2 remain factually qualified and are not inflated into measured savings or broad adoption claims.
  #
  # ========================================
  Background: User Story
    As a portfolio visitor evaluating a leadership candidate
    I want to understand how Brandon would think across AI enablement, quality engineering, and AI solutions leadership
    So that I can assess role-relevant judgment grounded in people-centered principles and verified experience

  Scenario: Visitor understands the AI enablement leadership lens
    Given a visitor opens the Leadership page
    When they read the AI enablement and developer experience perspective
    Then they see attention to employee friction, useful existing practices, coaching, and what people could do with time reclaimed from routine work
    And the content is framed as how Brandon would approach the role

  Scenario: Visitor understands the quality engineering leadership lens
    Given a visitor opens the Leadership page
    When they read the quality engineering perspective
    Then they see AI framed as widening what a team considers during quality work
    And people remain accountable for interpreting evidence and release readiness

  Scenario: Visitor understands the AI solutions ownership lens
    Given a visitor opens the Leadership page
    When they read the AI solutions and enterprise technology perspective
    Then they see attention to selecting meaningful opportunities, learning through bounded incubation, and owning outcomes through production and sustainment
    And outcomes, operating costs, and reclaimed employee time are described as things to evaluate rather than results already achieved

  Scenario: Visitor can distinguish documented experience from future approach
    Given a visitor reads the role perspectives and related case-study references
    When they compare proposed leadership priorities with documented work
    Then the page does not imply scaled developer infrastructure, formal Staff-plus coaching, or healthcare domain experience without supporting evidence
    And any acquisition delivery and incident-response facts remain limited to the supplied case narrative
