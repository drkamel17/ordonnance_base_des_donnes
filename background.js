// خدمة للتعامل مع الذاكرة المحلية
const storageService = {
    getTerms: function() {
        return new Promise((resolve) => {
            browser.storage.local.get('medicalTerms').then((result) => {
                const terms = result.medicalTerms || [];
                console.log('Loaded terms:', terms);
                resolve(terms);
            }).catch((error) => {
                console.error('Error loading medical terms:', error);
                resolve([]);
            });
        });
    },

    saveTerms: function(terms) {
        return new Promise((resolve) => {
            if (!Array.isArray(terms)) {
                console.error('Invalid terms format:', terms);
                resolve(false);
                return;
            }

            // Remove duplicates and sort
            const uniqueTerms = [...new Set(terms)].sort();
            
            browser.storage.local.set({ medicalTerms: uniqueTerms }).then(() => {
                console.log('Saved terms:', uniqueTerms);
                resolve(true);
            }).catch((error) => {
                console.error('Error saving medical terms:', error);
                resolve(false);
            });
        });
    }
};

// فتح نافذة جديدة عند النقر على أيقونة الإضافة
browser.browserAction.onClicked.addListener(() => {
    browser.tabs.create({
        url: browser.runtime.getURL("popup.html")
    });
});

// إضافة خدمة النقل
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTerms') {
        storageService.getTerms().then(terms => {
            sendResponse({ terms: terms });
        });
        return true; // نحتاج إلى الاحتفاظ بالاتصال حتى يتم الرد
    } else if (request.action === 'saveTerms') {
        if (request.terms) {
            storageService.saveTerms(request.terms).then(success => {
                sendResponse({ success: success });
            });
            return true;
        }
    }
});
