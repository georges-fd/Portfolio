

class DNA {

    constructor(dna) {
        this.genes = dna;
        this.mutationRate = 0.01;
        this.mutationAmount = 0.0025;
    }

    // Crossover, sharing 50% genes from both parents
    crossover(partner) {
        const childGenes = {};

        for (let key in this.genes) {
            childGenes[key] = random() < 0.5 ? this.genes[key] : partner.genes[key];
        }

        return new DNA(this.mutateGenes(childGenes));
    }

    // Apply genes mutations 
    mutateGenes(genes) {

        for (let key in genes) {
            if (random() <= this.mutationRate)
                genes[key] = genes[key] + random(-this.mutationAmount, this.mutationAmount);
        }

        return genes;
    }
}
