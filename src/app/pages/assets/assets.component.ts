import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Asset } from './asset.model';
import { AssetService } from '../services/asset.service';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './assets.html',
  styleUrls: ['./assets.css']
})
export class AssetsComponent implements OnInit {
  assets: Asset[] = [];
  selectedAsset: Asset | null = null;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';

  // ✅ Pagination + Search variables
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  searchTerm: string = '';

  constructor(
    private assetService: AssetService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAssets();

    // 🔁 Reload assets when navigating back to /assets
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/assets')) {
          this.loadAssets();
        }
      });
  }

  // ✅ Load all assets
  loadAssets() {
    this.assetService.getAssetsPaged(this.page, this.pageSize, this.searchTerm)
      .subscribe((res: any) => {
        this.assets = res.data.sort((a: any, b: any) => a.id - b.id); // ascending order by ID
        this.totalPages = res.pagination.totalPages;
        this.page = res.pagination.currentPage;
        this.cdr.detectChanges(); // ensure UI updates
      });
  }

  onSearch(): void {
    this.page = 1;
    this.loadAssets();
  }

  nextPage(): void {
    if (this.page < this.pageSize) {
      this.page++;
      this.loadAssets();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this, this.loadAssets();
    }
  }

  // ✅ Open modal
  openModal(mode: 'add' | 'edit', asset?: Asset) {
    this.modalMode = mode;
    this.showModal = true;
    this.selectedAsset = asset
      ? { ...asset }
      : {
        id: 0,
        assetName: '',
        category: '',
        serialNumber: '',
        purchaseDate: new Date(),
        isAvailable: true,
        isDamaged: false
      };
  }

  // ✅ Close modal
  closeModal() {
    this.showModal = false;
  }

  // ✅ Save or update
  saveAsset() {
    if (!this.selectedAsset) return;

    if (this.modalMode === 'add') {
      this.assetService.addAsset(this.selectedAsset).subscribe({
        next: () => {
          alert('✅ Asset added successfully');
          this.loadAssets();
          this.closeModal();
        },
        error: (err) => console.error('Error adding asset:', err)
      });
    } else {
      this.assetService.updateAsset(this.selectedAsset).subscribe({
        next: () => {
          alert('✅ Asset updated successfully');
          this.loadAssets();
          this.closeModal();
        },
        error: (err) => console.error('Error updating asset:', err)
      });
    }
  }

  // ✅ Delete asset
  deleteAsset(id: number) {
    if (confirm('Are you sure you want to delete this asset?')) {
      this.assetService.deleteAsset(id).subscribe({
        next: () => {
          alert('🗑️ Asset deleted successfully');
          this.loadAssets();
        },
        error: (err) => console.error('Error deleting asset:', err)
      });
    }
  }

  // ✅ Print all assets (styled window)
  printAllAssets() {
    this.assetService.getAllAssets().subscribe({
      next: (assets) => {
        const printableContent = this.generatePrintableAssetHTML(assets);
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
          printWindow.document.write('<html><head><title>Asset List</title></head><body>');
          printWindow.document.write(printableContent);
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.print();
        }
      },
      error: (err) => {
        console.error('Print error:', err);
        alert('❌ Failed to fetch asset data for printing.');
      }
    });
  }

  // ✅ Printable HTML layout
  generatePrintableAssetHTML(assets: Asset[]): string {
    const now = new Date().toLocaleString();

    let html = `
      <div style="text-align:center;">
        <img src="assets/images/emp_login.jpg" alt="Company Logo" height="60">
        <h2>Asset List</h2>
      </div>
      <p style="text-align:right;">Printed on: ${now}</p>
      <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse;">
        <thead style="background-color:#f2f2f2;">
          <tr>
            <th>ID</th>
            <th>Asset Name</th>
            <th>Category</th>
            <th>Serial Number</th>
            <th>Available</th>
            <th>Damaged</th>
            <th>Purchase Date</th>
          </tr>
        </thead>
        <tbody>
    `;

    assets.forEach(asset => {
      html += `
        <tr>
          <td>${asset.id}</td>
          <td>${asset.assetName}</td>
          <td>${asset.category}</td>
          <td>${asset.serialNumber}</td>
          <td>${asset.isAvailable ? 'Yes' : 'No'}</td>
          <td>${asset.isDamaged ? 'Yes' : 'No'}</td>
          <td>${new Date(asset.purchaseDate).toLocaleDateString()}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;
    return html;
  }
}
