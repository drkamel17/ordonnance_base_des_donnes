// Certificate Templates and Generation Logic

class CertificateGenerator {
    static templates = {
        arret: `
            <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 2rem; border: 1px solid #ccc;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">CERTIFICAT D'ARRÊT DE TRAVAIL</h2>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <p>Je soussigné, Dr <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Nom du médecin]</span>, certifie avoir examiné ce jour le(la) susnommé(e) <strong>[Nom du patient]</strong>, âgé(e) de <strong>[Âge]</strong> ans.</p>
                    
                    <p style="margin-top: 1.5rem;">Je déclare que son état de santé nécessite un arrêt de travail à compter du <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Date]</span> pour une durée de <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Durée]</span> jours, sauf complication.</p>
                </div>
                
                <div style="text-align: right; margin-top: 3rem;">
                    <p>Fait à <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Lieu]</span>, le <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Date]</span></p>
                    <p style="margin-top: 2rem;"><strong>Signature du médecin</strong></p>
                </div>
            </div>
        `,
        
        prolongation: `
            <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 2rem; border: 1px solid #ccc;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">CERTIFICAT DE PROLONGATION D'ARRÊT DE TRAVAIL</h2>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <p>Je soussigné, Dr <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Nom du médecin]</span>, certifie avoir examiné ce jour le(la) susnommé(e) <strong>[Nom du patient]</strong>, âgé(e) de <strong>[Âge]</strong> ans.</p>
                    
                    <p style="margin-top: 1.5rem;">Je déclare que son état de santé nécessite une prolongation d'arrêt de travail de <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Nombre]</span> jour(s) à dater du <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Date]</span> sauf complication.</p>
                </div>
                
                <div style="text-align: right; margin-top: 3rem;">
                    <p>Fait à <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Lieu]</span>, le <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Date]</span></p>
                    <p style="margin-top: 2rem;"><strong>Signature du médecin</strong></p>
                </div>
            </div>
        `,
        
        cbv: `
            <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 2rem; border: 1px solid #ccc;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">CERTIFICAT DE BONNE SANTÉ</h2>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <p>Je soussigné, Dr <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Nom du médecin]</span>, certifie après examen médical du susnommé(e) <strong>[Nom du patient]</strong>, âgé(e) de <strong>[Âge]</strong> ans, qu'il/elle jouit d'une parfaite santé et qu'il/elle est apte à exercer ses activités habituelles.</p>
                    
                    <p style="margin-top: 1.5rem;">Ce certificat est délivré pour servir et valoir ce que de droit.</p>
                </div>
                
                <div style="text-align: right; margin-top: 3rem;">
                    <p>Fait à <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Lieu]</span>, le <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Date]</span></p>
                    <p style="margin-top: 2rem;"><strong>Signature du médecin</strong></p>
                </div>
            </div>
        `,
        
        antirabique: `
            <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 2rem; border: 1px solid #ccc;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">CERTIFICAT ANTIRABIQUE</h2>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <p>Je soussigné, Dr <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Nom du médecin]</span>, certifie avoir examiné le(la) susnommé(e) <strong>[Nom du patient]</strong>, âgé(e) de <strong>[Âge]</strong> ans.</p>
                    
                    <p style="margin-top: 1.5rem;">Je déclare qu'il/elle a été vacciné(e) contre la rage conformément au protocole en vigueur.</p>
                    
                    <p style="margin-top: 1.5rem;">Les vaccinations ont été effectuées aux dates suivantes :</p>
                    <ul style="margin-top: 1rem; margin-left: 2rem;">
                        <li><span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Date 1]</span></li>
                        <li><span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Date 2]</span></li>
                        <li><span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Date 3]</span></li>
                    </ul>
                </div>
                
                <div style="text-align: right; margin-top: 3rem;">
                    <p>Fait à <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Lieu]</span>, le <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Date]</span></p>
                    <p style="margin-top: 2rem;"><strong>Signature du médecin</strong></p>
                </div>
            </div>
        `,
        
        brucellose: `
            <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 2rem; border: 1px solid #ccc;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">CERTIFICAT DE BRUCELLOSE</h2>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <p>Je soussigné, Dr <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Nom du médecin]</span>, certifie avoir examiné le(la) susnommé(e) <strong>[Nom du patient]</strong>, âgé(e) de <strong>[Âge]</strong> ans.</p>
                    
                    <p style="margin-top: 1.5rem;">Je déclare qu'il/elle a été traité(e) pour brucellose conformément au protocole thérapeutique en vigueur.</p>
                    
                    <p style="margin-top: 1.5rem;">Le traitement a consisté en l'administration de :</p>
                    <ul style="margin-top: 1rem; margin-left: 2rem;">
                        <li><span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Médicament 1]</span> pendant <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Durée]</span></li>
                        <li><span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Médicament 2]</span> pendant <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Durée]</span></li>
                    </ul>
                </div>
                
                <div style="text-align: right; margin-top: 3rem;">
                    <p>Fait à <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Lieu]</span>, le <span contenteditable="true" style="border-bottom: 1px dashed #000; padding: 2px 5px;">[Date]</span></p>
                    <p style="margin-top: 2rem;"><strong>Signature du médecin</strong></p>
                </div>
            </div>
        `
    };
    
    static generate(type, patientData) {
        if (!this.templates[type]) {
            throw new Error(`Template not found for certificate type: ${type}`);
        }
        
        let template = this.templates[type];
        
        // Get current date in French format
        const currentDate = new Date().toLocaleDateString('fr-FR');
        
        // Replace placeholders with actual data
        template = template.replace(/\[Nom du patient\]/g, patientData.name || '[Nom du patient]');
        template = template.replace(/\[Âge\]/g, patientData.age || '[Âge]');
        template = template.replace(/\[Date\]/g, currentDate);
        template = template.replace(/\[Lieu\]/g, patientData.location || '[Lieu]');
        
        // Add specific replacements based on certificate type
        switch (type) {
            case 'arret':
                template = template.replace(/\[Durée\]/g, patientData.duration || '[Durée]');
                break;
            case 'prolongation':
                template = template.replace(/\[Nombre\]/g, patientData.days || '[Nombre]');
                break;
        }
        
        return template;
    }
    
    static getTemplateNames() {
        return {
            'arret': 'Arrêt de travail',
            'prolongation': 'Prolongation',
            'cbv': 'Certificat de bonne santé',
            'antirabique': 'Certificat antirabique',
            'brucellose': 'Certificat de brucellose'
        };
    }
}