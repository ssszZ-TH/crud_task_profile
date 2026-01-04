*** Settings ***
Library    SeleniumLibrary
Suite Setup       Open Browser    http://localhost:5173    chrome
Suite Teardown    Close Browser
Test Setup        Go To    http://localhost:5173

*** Variables ***
${ADD_BUTTON}         //*[@id="root"]/div/div/div[1]/div/button[2]
${TITLE_INPUT}        //*[@id=":r59:"]
${DETAIL_INPUT}       //*[@id=":r5b:"]
${FNAME_INPUT}        //*[@id=":r5d:"]
${LNAME_INPUT}        //*[@id=":r5f:"]
${PHONE_INPUT}        //*[@id=":r5h:"]
${EMAIL_INPUT}        //*[@id=":r5j:"]
${MONTH_INPUT}        //*[@id="root"]/div/div/div/div[7]/div/div[1]/span[1]/span[2]
${DAY_INPUT}          //*[@id="root"]/div/div/div/div[7]/div/div[1]/span[2]/span[2]
${YEAR_INPUT}         //*[@id="root"]/div/div/div/div[7]/div/div[1]/span[3]/span[2]
${STATUS_DROPDOWN}    //*[@id=":r5r:"]
${SAVE_BUTTON}        //*[@id="root"]/div/div/div/div[9]/div/button[2]

*** Keywords ***
Click Add Button And Wait Page Load
    Wait Until Page Contains Element    ${ADD_BUTTON}    timeout=10s
    Click Element                       ${ADD_BUTTON}
    Wait Until Page Contains Element    ${TITLE_INPUT}    timeout=10s

Fill Required Fields
    [Arguments]    ${title}    ${fname}    ${lname}
    Input Text     ${TITLE_INPUT}     ${title}
    Input Text     ${FNAME_INPUT}     ${fname}
    Input Text     ${LNAME_INPUT}     ${lname}

Fill Optional Fields
    [Arguments]    ${detail}=${EMPTY}    ${phone}=${EMPTY}    ${email}=${EMPTY}    ${month}=${EMPTY}    ${day}=${EMPTY}    ${year}=${EMPTY}    ${status}=active
    Run Keyword If    '${detail}' != '${EMPTY}'    Input Text    ${DETAIL_INPUT}    ${detail}
    Run Keyword If    '${phone}' != '${EMPTY}'     Input Text    ${PHONE_INPUT}     ${phone}
    Run Keyword If    '${email}' != '${EMPTY}'     Input Text    ${EMAIL_INPUT}     ${email}
    Run Keyword If    '${month}' != '${EMPTY}'     Input Text    ${MONTH_INPUT}     ${month}
    Run Keyword If    '${day}' != '${EMPTY}'       Input Text    ${DAY_INPUT}       ${day}
    Run Keyword If    '${year}' != '${EMPTY}'      Input Text    ${YEAR_INPUT}      ${year}
    Run Keyword If    '${status}' != 'active'      Select Status From Dropdown    ${status}

Select Status From Dropdown
    [Arguments]    ${status}
    Click Element                    ${STATUS_DROPDOWN}
    ${option_xpath}    Set Variable    //li[text()='${status}']
    Wait Until Element Is Visible    ${option_xpath}    timeout=5s
    Click Element                    ${option_xpath}

Click Save And Wait Success
    Click Element    ${SAVE_BUTTON}
    Wait Until Page Does Not Contain Element    ${SAVE_BUTTON}    timeout=10s
    Location Should Be    http://localhost:5173/

*** Test Cases ***
TC001 - Create New Task Profile Successfully (Minimal Required Fields)
    Click Add Button And Wait Page Load
    Fill Required Fields    Test Task Title    John    Doe
    Click Save And Wait Success

TC002 - Create With All Fields Filled Correctly
    Click Add Button And Wait Page Load
    Fill Required Fields    Premium Insurance Follow-up    Alice    Smith
    Fill Optional Fields    
    ...    detail=Follow up on premium plan interest    
    ...    phone=1234567890123    
    ...    email=alice.smith@example.com    
    ...    month=05    
    ...    day=15    
    ...    year=1990    
    ...    status=active
    Click Save And Wait Success

TC003 - Create With Inactive Status
    Click Add Button And Wait Page Load
    Fill Required Fields    Paused Customer Contact    Bob    Johnson
    Fill Optional Fields    status=inactive
    Click Save And Wait Success

TC004 - Create With Done Status
    Click Add Button And Wait Page Load
    Fill Required Fields    Completed Claim Case    Carol    Williams
    Fill Optional Fields    status=done
    Click Save And Wait Success

TC005 - Validation Error - Missing Required Fields
    Click Add Button And Wait Page Load
    Click Element    ${SAVE_BUTTON}
    Wait Until Page Contains    Task Title, First Name, and Last Name are required    timeout=5s

TC006 - Validation Error - Invalid Phone Number
    Click Add Button And Wait Page Load
    Fill Required Fields    Invalid Phone Test    Test    User
    Input Text       ${PHONE_INPUT}    abc123
    Click Element    ${SAVE_BUTTON}
    Wait Until Page Contains    Invalid phone format    timeout=5s

TC007 - Validation Error - Invalid Email
    Click Add Button And Wait Page Load
    Fill Required Fields    Invalid Email Test    Test    User
    Input Text       ${EMAIL_INPUT}    not-an-email
    Click Element    ${SAVE_BUTTON}
    Wait Until Page Contains    Invalid email address    timeout=5s