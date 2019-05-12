describe('End2End Tests', function() {
    it('should see the main page', function () {
        browser.url('http://localhost:8081'); // SETUP

        var title = browser.getTitle();   // EXECUTE

        expect(title).to.equal('SmartChain'); // VERIFY 
    })

    it('should be able to switch page', async function () {
        browser.url('http://localhost:8081'); // SETUP

        const openNavigationButton = browser.$('.openNavigation')
        openNavigationButton.click()

        await sleep(200);

        const switchPageButton = browser.$('.yourAccesses')
        switchPageButton.click()

        // if (browser.isAlertOpen()){
        //     browser.acceptAlert()
        // }

        await sleep(1000)

        const registerLockButtonExists = browser.$('.registerLockButton').waitForExist()  // EXECUTE

        expect(registerLockButtonExists).to.equal(true); // VERIFY 
    })
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}