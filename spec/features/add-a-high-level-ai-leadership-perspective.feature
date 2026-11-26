@requirements
@ui
@PORT-032
Feature: Create a dedicated AI leadership perspective page
  """
  Build a detailed standalone public/how-i-think-about-ai.html page using the shared site shell and editorial CSS. Link it from the AI Enablement page and footer. Include it in scripts/build.mjs, public/sitemap.xml, and public/llms.txt. Explain people-centered leadership reasoning, current capabilities, AI concepts, context, delegation, accountability, safeguards, adoption, prioritization, and honest measurement. Keep proprietary instructions and employer-specific procedures private; clearly distinguish proposed approach from documented experience.
  """

  Background: User Story
    As a portfolio visitor or hiring leader
    I want to read a detailed standalone statement of how Brandon thinks about AI and leads its use
    So that I can assess his people-centered judgment, operating principles, and tradeoffs without being given proprietary implementation procedures

  Scenario: Visitor opens the perspective page from AI Enablement
    Given a visitor is reading the AI Enablement page
    When they follow the "How I think about AI" link
    Then a dedicated page explains Brandon's AI leadership perspective
    And the page uses the site's shared navigation and professional visual style

  Scenario: Visitor understands the people-centered starting point
    Given a visitor reads the perspective page
    When they review how Brandon approaches existing systems, employee friction, and human strengths
    Then they understand he would learn what already works and build forward with the people closest to the work

  Scenario: Visitor sees how AI capabilities fit within accountable work
    Given a visitor reads the sections about concepts, context, and responsibility
    When they consider prompts, skills, agents, workflows, context sharing, and approvals
    Then they see these as leadership choices shaped by human accountability, consequences, uncertainty, and operating tradeoffs
    And they do not receive reusable prompts, exact system designs, or step-by-step procedures

  Scenario: Visitor understands how improvements and outcomes would be considered
    Given a visitor reads the sections about improvement choices, adoption, and measurement
    When they review employee involvement, operating costs, workflow outcomes, and reclaimed capacity
    Then they understand these are proposed leadership considerations rather than historical company-wide results
    And the page distinguishes time made available from measured financial savings

  Scenario: Hiring reader compares role-specific leadership questions
    Given a hiring reader opens the AI leadership perspective page
    When they review the AI enablement, quality engineering, and enterprise AI solutions sections
    Then they can distinguish what Brandon would pay attention to in each role
    And each role perspective remains a proposed approach grounded in shared people-centered principles
